import React, { useState, useMemo } from 'react';
import { IonModal, IonSpinner, IonNote } from '@ionic/react';
import { marked } from 'marked';
import { UserCancelledError } from '../services/UpdateService';
import './UpdateDialog.css';

interface UpdateDialogProps {
    version: string;
    changelog: string;
    onUpdate: () => Promise<void>;
    onDismiss: () => void;
}

const UpdateDialog: React.FC<UpdateDialogProps> = ({ version, changelog, onUpdate, onDismiss }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [warnMsg, setWarnMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Parse markdown once — memoized, only re-parses if changelog changes
    const parsedChangelog = useMemo(() => marked.parse(changelog) as string, [changelog]);

    const handleUpdate = async () => {
        setIsDownloading(true);
        setWarnMsg('');
        setErrorMsg('');
        try {
            await onUpdate();
            onDismiss();
        } catch (err: unknown) {
            if (err instanceof UserCancelledError) {
                setWarnMsg("Please enable 'Install Unknown Apps' for this app, then tap Update Now again.");
            } else {
                setErrorMsg((err as Error).message);
            }
            setIsDownloading(false);
        }
    };

    return (
        <IonModal isOpen={true} onDidDismiss={onDismiss} className="update-dialog-modal">
            <div className="update-dialog-wrapper">
                <h2 className="update-title">Update Available</h2>
                <p className="update-subtitle">Version {version} is ready to install</p>

                <div className="update-changelog-container">
                    {/* ✅ dangerouslySetInnerHTML renders parsed markdown HTML */}
                    <div
                        className="update-changelog-text"
                        dangerouslySetInnerHTML={{ __html: parsedChangelog }}
                    />
                    <div className="update-fade-out"></div>
                </div>

                {warnMsg && (
                    <IonNote color="warning" style={{ display: 'block', margin: '12px 0', fontSize: '0.9rem' }}>
                        {warnMsg}
                    </IonNote>
                )}
                {errorMsg && (
                    <IonNote color="danger" style={{ display: 'block', margin: '12px 0', fontSize: '0.9rem' }}>
                        {errorMsg}
                    </IonNote>
                )}

                <div className="update-actions">
                    <button className="update-later-btn" onClick={onDismiss} disabled={isDownloading}>
                        Later
                    </button>
                    <button className="update-now-btn" onClick={handleUpdate} disabled={isDownloading}>
                        {isDownloading
                            ? <><IonSpinner name="crescent" style={{ width: '1em', height: '1em', marginRight: '8px' }} />Downloading…</>
                            : 'Update Now'
                        }
                    </button>
                </div>
            </div>
        </IonModal>
    );
};

export default UpdateDialog;
