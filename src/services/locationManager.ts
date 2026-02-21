/**
 * Location Manager Service
 *
 * Handles location data persistence using @capacitor/preferences and
 * fetches GPS coordinates using @capacitor/geolocation.
 *
 * Default location: Nagpur, Maharashtra (Center of India / Deekshabhoomi).
 */
import { Preferences } from '@capacitor/preferences';
import { Observer } from '@ishubhamx/panchangam-js';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SavedLocation {
    name: string;
    latitude: number;
    longitude: number;
    altitude: number; // in meters
    timezone?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'uposatha_location';

const DEFAULT_LOCATION: SavedLocation = {
    name: 'Bodh Gaya, Bihar',
    latitude: 24.6959,
    longitude: 84.9914,
    altitude: 111,
    timezone: 'Asia/Kolkata',
};

// ─── Core Function ───────────────────────────────────────────────────────────

/**
 * Get the saved location from storage, or default if none.
 */
export async function getSavedLocation(): Promise<SavedLocation> {
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    if (value) {
        try {
            return JSON.parse(value) as SavedLocation;
        } catch (e) {
            console.error('Error parsing saved location', e);
        }
    }
    return DEFAULT_LOCATION;
}

/**
 * Save a new location to storage.
 */
export async function saveLocation(location: SavedLocation): Promise<void> {
    await Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify(location),
    });
}



/**
 * Convert internal SavedLocation to astronomy-engine Observer.
 */
export function getObserver(location: SavedLocation): Observer {
    return new Observer(location.latitude, location.longitude, location.altitude);
}
