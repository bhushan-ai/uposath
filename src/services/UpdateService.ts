import { AppInstallPlugin } from '@m430/capacitor-app-install';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { CapacitorHttp } from '@capacitor/core';
import { App } from '@capacitor/app';

export class UserCancelledError extends Error { }

const GITHUB_API = "https://api.github.com/repos/Stonks007/uposath/releases/latest";

export interface ReleaseInfo {
    version: string;
    changelog: string;
    apkUrl: string | null;
}

class UpdateService {
    private static instance: UpdateService;

    private constructor() { }

    public static getInstance(): UpdateService {
        if (!UpdateService.instance) {
            UpdateService.instance = new UpdateService();
        }
        return UpdateService.instance;
    }

    public async getLatestRelease(): Promise<ReleaseInfo | null> {
        try {
            const response = await fetch(GITHUB_API);
            if (!response.ok) return null;

            const data = await response.json();
            const releaseVersion = data.tag_name
                ? data.tag_name.replace(/^v/, '')
                : '';
            const changelog = data.body || '';

            let apkUrl = null;
            if (data.assets && Array.isArray(data.assets)) {
                const apkAsset = data.assets.find(
                    (asset: any) => asset.name && asset.name.endsWith('.apk')
                );
                if (apkAsset) {
                    apkUrl = apkAsset.browser_download_url;
                }
            }

            return { version: releaseVersion, changelog, apkUrl };
        } catch (error) {
            console.error('Error fetching latest release:', error);
            return null;
        }
    }

    public async checkForUpdate(): Promise<ReleaseInfo | null> {
        try {
            const release = await this.getLatestRelease();
            if (!release || !release.apkUrl) return null;

            const { version: currentVersion } = await App.getInfo();

            if (!this.semverGt(release.version, currentVersion)) return null;

            return release;
        } catch (error) {
            console.error('Error checking for update:', error);
            return null;
        }
    }

    public async openDownload(apkUrl: string, releaseVersion: string): Promise<void> {

        // Step A: Check install unknown apps permission
        const { granted } = await AppInstallPlugin.canInstallUnknownApps();
        if (!granted) {
            await AppInstallPlugin.openInstallUnknownAppsSettings();
            throw new UserCancelledError(
                "Please enable 'Install Unknown Apps' for this app, " +
                "then tap Update Now again."
            );
        }

        // Step B: Download APK using native HTTP client
        // CapacitorHttp uses Android's HttpURLConnection — follows GitHub
        // redirects natively, no CORS, no WebView fetch restrictions
        const fileName = `uposath-v${releaseVersion}.apk`;

        let base64Data: string;
        try {
            const httpResponse = await CapacitorHttp.request({
                method: 'GET',
                url: apkUrl,
                responseType: 'blob',   // returns base64 string directly
                headers: {
                    'Accept': 'application/octet-stream',
                },
            });

            if (httpResponse.status !== 200) {
                throw new Error(`HTTP ${httpResponse.status}`);
            }

            base64Data = httpResponse.data; // already base64 — no conversion needed

        } catch (e: any) {
            throw new Error(`Download failed: ${e.message}`);
        }

        // Step C: Write base64 APK to cache directory
        await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache,
        });

        // Step D: Resolve native file URI
        const { uri } = await Filesystem.getUri({
            path: fileName,
            directory: Directory.Cache,
        });

        // Step E: Launch Android package installer
        const result = await AppInstallPlugin.installApk({ filePath: uri });
        if (!result.completed) {
            throw new Error(result.message ?? 'Install failed');
        }
    }

    private semverGt(a: string, b: string): boolean {
        const pa = a.split('.').map(Number);
        const pb = b.split('.').map(Number);
        for (let i = 0; i < 3; i++) {
            if ((pa[i] ?? 0) > (pb[i] ?? 0)) return true;
            if ((pa[i] ?? 0) < (pb[i] ?? 0)) return false;
        }
        return false;
    }
}

export default UpdateService.getInstance();
