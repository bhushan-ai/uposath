/**
 * Location Manager Service
 *
 * Handles location data persistence using @capacitor/preferences and
 * fetches GPS coordinates using @capacitor/geolocation.
 *
 * Default location: Nagpur, Maharashtra (Center of India / Deekshabhoomi).
 */
import { Preferences } from '@capacitor/preferences';
import { Geolocation } from '@capacitor/geolocation';
import { Observer } from 'astronomy-engine';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SavedLocation {
    name: string;
    latitude: number;
    longitude: number;
    altitude: number; // in meters
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'uposatha_location';

const DEFAULT_LOCATION: SavedLocation = {
    name: 'Gaya, Bihar',
    latitude: 24.7914,
    longitude: 85.0002,
    altitude: 111,
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
 * Get current GPS location.
 * Returns null if permission denied or error.
 */
export async function getCurrentGPS(): Promise<SavedLocation | null> {
    try {
        const position = await Geolocation.getCurrentPosition();
        return {
            name: 'Current Location',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude || 0,
        };
    } catch (e) {
        console.error('Error getting GPS location', e);
        return null;
    }
}

/**
 * Convert internal SavedLocation to astronomy-engine Observer.
 */
export function getObserver(location: SavedLocation): Observer {
    return new Observer(location.latitude, location.longitude, location.altitude);
}
