/**
 * Buddhist Festival Service
 *
 * Detects Buddhist-only festivals (Vesak, Māgha Pūjā, Āsāḷha Pūjā)
 * based on Full Moon (Purnima) in the correct lunar month.
 *
 * IMPORTANT: No Hindu festivals are included. The Panchang engine is
 * used purely as an astronomical calculator.
 */
import { getPanchangam, type Panchangam } from '@ishubhamx/panchangam-js';
import type { Observer } from 'astronomy-engine';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BuddhistFestival {
    id: string;
    name: string;
    /** Lunar month name to match against panchangam.masa.name */
    masaName: string;
    /** 0-indexed tithi (14 = Purnima) */
    tithiIndex: number;
    description: string;
    traditions: string[];
}

export interface FestivalMatch {
    festival: BuddhistFestival;
    date: Date;
    daysRemaining: number;
}

// ─── Festival Definitions ────────────────────────────────────────────────────

const BUDDHIST_FESTIVALS: BuddhistFestival[] = [
    {
        id: 'vesak',
        name: 'Vesak (Buddha Pūrṇimā)',
        masaName: 'Vaishakha', // masa.index === 1
        tithiIndex: 14,
        description:
            'Celebrates the Birth, Enlightenment, and Parinirvana of the Buddha. The most sacred day in the Buddhist calendar.',
        traditions: ['Theravada', 'Mahayana', 'Thai'],
    },
    {
        id: 'magha_puja',
        name: 'Māgha Pūjā',
        masaName: 'Magha', // masa.index === 10
        tithiIndex: 14,
        description:
            'Commemorates the spontaneous gathering of 1,250 Arahants before the Buddha. Celebrates the qualities of the Sangha.',
        traditions: ['Theravada', 'Thai'],
    },
    {
        id: 'asalha_puja',
        name: 'Āsāḷha Pūjā',
        masaName: 'Ashadha', // masa.index === 3
        tithiIndex: 14,
        description:
            'Marks the Buddha\'s first sermon (Dhammacakkappavattana Sutta) and the beginning of Vassa (Rains Retreat).',
        traditions: ['Theravada', 'Thai'],
    },
];

// ─── Core Functions ──────────────────────────────────────────────────────────

/**
 * Check if a date has a Buddhist festival.
 * All three festivals occur on Purnima (tithi index 14) of specific months.
 *
 * Can optionally accept a pre-computed panchangam to avoid redundant calls.
 */
export function checkFestival(
    date: Date,
    observer: Observer,
    panchangam?: Panchangam
): BuddhistFestival | null {
    const p = panchangam ?? getPanchangam(date, observer);

    // All Buddhist festivals are on Purnima
    if (p.tithi !== 14) return null;

    // Match the lunar month name
    const match = BUDDHIST_FESTIVALS.find((f) => f.masaName === p.masa.name);
    return match ?? null;
}

/**
 * Check if a date has a Buddhist festival, filtered by tradition.
 */
export function checkFestivalByTradition(
    date: Date,
    observer: Observer,
    tradition: string,
    panchangam?: Panchangam
): BuddhistFestival | null {
    const festival = checkFestival(date, observer, panchangam);
    if (!festival) return null;
    return festival.traditions.includes(tradition) ? festival : null;
}

/**
 * Scan forward from a start date and return all upcoming Buddhist festivals.
 *
 * Optimization: since all festivals are on Purnima, once we find a Purnima
 * we skip ahead ~25 days for the next one instead of checking every single day.
 */
export function getUpcomingFestivals(
    startDate: Date,
    observer: Observer,
    days = 365
): FestivalMatch[] {
    const results: FestivalMatch[] = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);

    const current = new Date(startDate);

    while (current < endDate) {
        const p = getPanchangam(current, observer);

        if (p.tithi === 14) {
            // This is a Purnima — check for festival
            const festival = checkFestival(current, observer, p);
            if (festival) {
                const daysRemaining = Math.ceil(
                    (current.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
                );
                results.push({
                    festival,
                    date: new Date(current),
                    daysRemaining,
                });
            }
            // Skip ahead ~25 days to next probable Purnima
            current.setDate(current.getDate() + 25);
        } else {
            // Not Purnima — advance by 1 day
            current.setDate(current.getDate() + 1);
        }
    }

    return results;
}

/**
 * Get the list of all defined Buddhist festivals (for reference/display).
 */
export function getAllFestivalDefinitions(): BuddhistFestival[] {
    return [...BUDDHIST_FESTIVALS];
}
