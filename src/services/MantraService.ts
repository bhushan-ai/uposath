import { Preferences } from '@capacitor/preferences';
import { Mantra, MantraSession, MantraTradition } from '../types/SatiTypes';
import { BasePracticeRepository } from './BasePracticeRepository';
import { StatsCalculator } from './StatsCalculator';

const MANTRA_STORAGE_KEY = 'user_mantras';
const SESSION_STORAGE_KEY = 'mantra_sessions';

const DEFAULT_MANTRAS: Mantra[] = [
    {
        id: 'default_avalokitesvara',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        basic: {
            name: 'Great Compassion Mantra',
            deity: 'Avalokiteśvara',
            icon: '🌟'
        },
        text: {
            primaryScript: 'devanagari',
            primaryText: 'ॐ मणि पद्मे हूँ',
            transliteration: 'Oṃ Maṇi Padme Hūṃ'
        },
        tradition: 'mahayana',
        purpose: 'Cultivating compassion for all beings',
        practice: {
            defaultReps: 108,
            defaultDurationMinutes: 15,
            bellAtCompletion: true
        },
        stats: {
            totalSessions: 0,
            totalReps: 0,
            totalDurationMinutes: 0,
            currentStreak: 0
        }
    },
    {
        id: 'default_tara',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        basic: {
            name: 'Green Tārā Mantra',
            deity: 'Green Tārā',
            icon: '☸️'
        },
        text: {
            primaryScript: 'devanagari',
            primaryText: 'ॐ तारे तुत्तारे तुरे स्वाहा',
            transliteration: 'Oṃ Tāre Tuttāre Ture Svāhā'
        },
        tradition: 'tibetan',
        purpose: 'Protection and overcoming fear',
        practice: {
            defaultReps: 108,
            defaultDurationMinutes: 15,
            bellAtCompletion: true
        },
        stats: {
            totalSessions: 0,
            totalReps: 0,
            totalDurationMinutes: 0,
            currentStreak: 0
        }
    },
    {
        id: 'default_medicine_buddha',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        basic: {
            name: 'Medicine Buddha Mantra',
            deity: 'Bhaiṣajyaguru',
            icon: '✨'
        },
        text: {
            primaryScript: 'devanagari',
            primaryText: 'ॐ भैषज्ये भैषज्ये महाभैषज्ये भैषज्य समुद्गते स्वाहा',
            transliteration: 'Oṃ Bhaiṣajye Bhaiṣajye Mahābhaiṣajye Bhaiṣajya Samudgate Svāhā'
        },
        tradition: 'mahayana',
        purpose: 'Healing and purification',
        practice: {
            defaultReps: 108,
            defaultDurationMinutes: 15,
            bellAtCompletion: true
        },
        stats: {
            totalSessions: 0,
            totalReps: 0,
            totalDurationMinutes: 0,
            currentStreak: 0
        }
    }
];

const mantraRepository = new BasePracticeRepository<Mantra>(MANTRA_STORAGE_KEY);
const sessionRepository = new BasePracticeRepository<MantraSession>(SESSION_STORAGE_KEY);

export const MantraService = {

    async getMantras(): Promise<Mantra[]> {
        const mantras = await mantraRepository.getAll();
        if (mantras.length === 0) {
            // Seed defaults if empty
            await this.saveMantras(DEFAULT_MANTRAS);
            return DEFAULT_MANTRAS;
        }
        return mantras;
    },

    async saveMantras(mantras: Mantra[]): Promise<void> {
        await mantraRepository.saveAll(mantras);
    },

    async addMantra(mantra: Mantra): Promise<void> {
        // Appending to the end traditionally for mantras
        const mantras = await this.getMantras();
        mantras.push(mantra);
        await this.saveMantras(mantras);
    },

    async updateMantra(updatedMantra: Mantra): Promise<void> {
        await mantraRepository.update(updatedMantra);
    },

    async deleteMantra(id: string): Promise<void> {
        await mantraRepository.delete(id);
    },

    async getSessions(): Promise<MantraSession[]> {
        return sessionRepository.getAll();
    },

    async saveSession(session: MantraSession): Promise<void> {
        await sessionRepository.add(session);

        // Update stats for the mantra
        await this.recalculateMantraStats(session.mantraId);
    },

    async deleteSession(id: string): Promise<void> {
        const sessions = await this.getSessions();
        const sessionToDelete = sessions.find(s => s.id === id);
        if (sessionToDelete) {
            await sessionRepository.delete(id);
            await this.recalculateMantraStats(sessionToDelete.mantraId);
        }
    },

    async updateSession(updatedSession: MantraSession): Promise<void> {
        await sessionRepository.update(updatedSession);
        await this.recalculateMantraStats(updatedSession.mantraId);
    },

    async recalculateMantraStats(mantraId: string): Promise<void> {
        const allSessions = await this.getSessions();
        const mantraSessions = allSessions.filter(s => s.mantraId === mantraId);

        const mantras = await this.getMantras();
        const mantraIndex = mantras.findIndex(m => m.id === mantraId);

        if (mantraIndex !== -1) {
            const m = mantras[mantraIndex];

            m.stats.totalSessions = mantraSessions.length;
            m.stats.totalReps = mantraSessions.reduce((acc, s) => acc + s.reps, 0);
            m.stats.totalDurationMinutes = mantraSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

            const uniqueDates = Array.from(new Set(mantraSessions.map(s => s.timestamp.split('T')[0]))).sort().reverse();
            m.stats.lastPracticeDate = uniqueDates.length > 0 ? uniqueDates[0] : undefined;
            m.stats.currentStreak = StatsCalculator.calculateStreak(uniqueDates);

            await this.updateMantra(m);
        }
    },

    // Helper to create a new Mantra object with defaults
    createNewMantra(): Mantra {
        return {
            id: crypto.randomUUID(),
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            basic: {
                name: '',
                icon: '📿'
            },
            text: {
                primaryScript: 'roman', // Default
                primaryText: ''
            },
            tradition: 'custom',
            practice: {
                defaultReps: 108,
                defaultDurationMinutes: 15,
                bellAtCompletion: true
            },
            stats: {
                totalSessions: 0,
                totalReps: 0,
                totalDurationMinutes: 0,
                currentStreak: 0
            }
        };
    }
};
