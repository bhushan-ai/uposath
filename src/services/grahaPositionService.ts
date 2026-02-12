/**
 * Graha Position Service
 *
 * Transforms raw planetary position data from the Panchangam into
 * display-ready "Graha Cards" showing rashi, degree, retrograde status, etc.
 */

import type { Panchangam } from '@ishubhamx/panchangam-js';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GrahaCard {
    id: string;          // 'sun', 'moon', 'mars', etc.
    englishName: string; // "Sun"
    sanskritName: string; // "Sūrya"
    icon: string;        // "☉"
    rashiName: string;   // "Capricorn"
    rashiSymbol: string; // "♑"
    degree: number;      // 21.2
    isRetrograde: boolean;
    dignity: string;     // 'exalted' | 'debilitated' | 'own' | 'neutral'
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PLANET_META: Record<string, { english: string; sanskrit: string; icon: string }> = {
    sun: { english: 'Sun', sanskrit: 'Sūrya', icon: '☉' },
    moon: { english: 'Moon', sanskrit: 'Chandra', icon: '☽' },
    mars: { english: 'Mars', sanskrit: 'Maṅgala', icon: '♂' },
    mercury: { english: 'Mercury', sanskrit: 'Budha', icon: '☿' },
    jupiter: { english: 'Jupiter', sanskrit: 'Guru', icon: '♃' },
    venus: { english: 'Venus', sanskrit: 'Śukra', icon: '♀' },
    saturn: { english: 'Saturn', sanskrit: 'Śani', icon: '♄' },
    rahu: { english: 'Rahu', sanskrit: 'Rāhu', icon: '☊' },
    ketu: { english: 'Ketu', sanskrit: 'Ketu', icon: '☋' },
};

const RASHI_SYMBOLS = [
    '♈', // Aries
    '♉', // Taurus
    '♊', // Gemini
    '♋', // Cancer
    '♌', // Leo
    '♍', // Virgo
    '♎', // Libra
    '♏', // Scorpio
    '♐', // Sagittarius
    '♑', // Capricorn
    '♒', // Aquarius
    '♓', // Pisces
];

// ─── Core Function ───────────────────────────────────────────────────────────

/**
 * Get display cards for all 9 Grahas based on the panchangam data.
 */
export function getGrahaCards(panchangam: Panchangam): GrahaCard[] {
    const positions = panchangam.planetaryPositions;
    // Order: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
    const planetKeys = [
        'sun',
        'moon',
        'mars',
        'mercury',
        'jupiter',
        'venus',
        'saturn',
        'rahu',
        'ketu'
    ] as const;

    return planetKeys.map((key) => {
        // @ts-ignore - The type definition in library might not strictly match keys
        // but runtime object structure does have these exact keys.
        const planetData = positions[key];
        const meta = PLANET_META[key];

        // Some library versions capitalizes keys or not - check carefully
        // Based on index.d.ts, it returns { sun: ..., moon: ... }

        // Degree within the sign = longitude % 30
        // Library provides `degree` which is usually the degree within sign
        const degree = typeof planetData.degree === 'number'
            ? planetData.degree
            : (planetData.longitude % 30);

        return {
            id: key,
            englishName: meta.english,
            sanskritName: meta.sanskrit,
            icon: meta.icon,
            rashiName: planetData.rashiName,
            rashiSymbol: RASHI_SYMBOLS[planetData.rashi] || '?',
            degree: Number(degree.toFixed(2)),
            isRetrograde: planetData.isRetrograde,
            dignity: planetData.dignity,
        };
    });
}
