
import { Preferences } from '@capacitor/preferences';
import { MalaEntry, MalaStats, SatiPreferences, DEFAULT_PREFERENCES, PracticeStats } from '../types/SatiTypes';
import { BasePracticeRepository } from './BasePracticeRepository';
import { StatsCalculator } from './StatsCalculator';

const STORE_KEY_ENTRIES = 'sati_mala_entries';
const STORE_KEY_PREFS = 'sati_mala_preferences';

const repository = new BasePracticeRepository<MalaEntry>(STORE_KEY_ENTRIES);

// Helper: Parse dates safely
const parseDate = (dateStr: string) => new Date(dateStr);

export const MalaService = {
    // --- Entries ---

    async getEntries(): Promise<MalaEntry[]> {
        return repository.getAll();
    },

    async saveEntry(entry: MalaEntry): Promise<void> {
        await repository.add(entry);
    },

    async updateEntry(updatedEntry: MalaEntry): Promise<void> {
        await repository.update(updatedEntry);
    },

    async deleteEntry(id: string): Promise<void> {
        await repository.delete(id);
    },

    // --- Stats Calculation ---

    async getStats(): Promise<MalaStats> {
        const entries = await MalaService.getEntries();
        const emptyStats: PracticeStats = { totalBeads: 0, totalSessions: 0, currentStreak: 0, lastPracticeDate: '' };

        // Initialize aggregation structure
        const stats: MalaStats = {
            overall: { ...emptyStats },
            byType: {
                buddha: { ...emptyStats },
                dhamma: { ...emptyStats },
                sangha: { ...emptyStats }
            },
            practiceDays: 0
        };

        if (entries.length === 0) return stats;

        // Calculate Totals and Sessions
        entries.forEach(e => {
            // Normalize type - handle legacy casing or missing types
            let rawType = (e.practiceType || 'buddha').toLowerCase();
            let typeKey: 'buddha' | 'dhamma' | 'sangha' | 'unknown' = 'unknown';

            if (rawType.includes('budd')) typeKey = 'buddha';
            else if (rawType.includes('dham')) typeKey = 'dhamma';
            else if (rawType.includes('sang')) typeKey = 'sangha';

            const beads = Number(e.beads) || 0;

            // Update Overall
            stats.overall.totalBeads += beads;
            stats.overall.totalSessions += 1;

            // Update Type Specific
            if (typeKey !== 'unknown' && stats.byType[typeKey]) {
                stats.byType[typeKey].totalBeads += beads;
                stats.byType[typeKey].totalSessions += 1;
            }
        });

        // Calculate Unique Practice Days (Overall)
        const allDates = Array.from(new Set(entries
            .filter(e => e.timestamp)
            .map(e => e.timestamp.split('T')[0])
        )).sort();

        stats.practiceDays = allDates.length;
        stats.overall.lastPracticeDate = allDates[allDates.length - 1] || '';

        // Overall Streak
        stats.overall.currentStreak = StatsCalculator.calculateStreak(allDates);

        // Type Specific Streaks and Last Dates
        (['buddha', 'dhamma', 'sangha'] as const).forEach(type => {
            const typeEntries = entries.filter(e => {
                const rawType = (e.practiceType || 'buddha').toLowerCase();
                if (type === 'buddha' && rawType.includes('budd')) return true;
                if (type === 'dhamma' && rawType.includes('dham')) return true;
                if (type === 'sangha' && rawType.includes('sang')) return true;
                return false;
            });
            const typeDates = Array.from(new Set(typeEntries.filter(e => e.timestamp).map(e => e.timestamp.split('T')[0]))).sort();

            if (stats.byType[type]) {
                stats.byType[type].currentStreak = StatsCalculator.calculateStreak(typeDates);
                stats.byType[type].lastPracticeDate = typeDates[typeDates.length - 1] || '';
            }
        });

        return stats;
    },

    async getTodayTotal(type?: string): Promise<number> {
        const entries = await MalaService.getEntries();
        const today = new Date().toISOString().split('T')[0];

        return entries
            .filter(e => e.timestamp.startsWith(today))
            .filter(e => !type || (e.practiceType || 'buddha') === type)
            .reduce((sum, e) => sum + e.beads, 0);
    },

    // --- Preferences ---

    async getPreferences(): Promise<SatiPreferences> {
        const { value } = await Preferences.get({ key: STORE_KEY_PREFS });
        if (!value) return DEFAULT_PREFERENCES;
        try {
            return { ...DEFAULT_PREFERENCES, ...JSON.parse(value) };
        } catch {
            return DEFAULT_PREFERENCES;
        }
    },

    async savePreferences(prefs: SatiPreferences): Promise<void> {
        await Preferences.set({
            key: STORE_KEY_PREFS,
            value: JSON.stringify(prefs)
        });
    }
};
