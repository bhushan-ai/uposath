import { Preferences } from '@capacitor/preferences';
import emptinessData from '../assets/data/emptiness.json';
import { EmptinessData, EmptinessSession, EmptinessStats } from '../types/SatiTypes';
import { BasePracticeRepository } from './BasePracticeRepository';
import { StatsCalculator } from './StatsCalculator';

// Type assertion for JSON import
const content: EmptinessData = emptinessData as unknown as EmptinessData;

const SESSION_KEY = 'emptiness_sessions';

const sessionRepository = new BasePracticeRepository<EmptinessSession>(SESSION_KEY);

export const EmptinessService = {
    // Content
    getContent: (): EmptinessData => content,

    // Sessions
    getSessions: async (): Promise<EmptinessSession[]> => {
        return sessionRepository.getAll();
    },

    saveSession: async (session: EmptinessSession): Promise<void> => {
        await sessionRepository.add(session);
    },

    deleteSession: async (id: string): Promise<void> => {
        await sessionRepository.delete(id);
    },

    updateSession: async (updatedSession: EmptinessSession): Promise<void> => {
        await sessionRepository.update(updatedSession);
    },

    // Stats
    getStats: async (): Promise<EmptinessStats> => {
        const sessions = await EmptinessService.getSessions();
        const completedSessions = sessions.filter(s => s.completed || s.durationMinutes > 5);

        const totalSessions = completedSessions.length;
        const totalMinutes = completedSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

        // Calculate streaks
        const uniqueDates = Array.from(new Set(
            completedSessions.map(s => s.timestamp.split('T')[0])
        )).sort().reverse();

        const currentStreak = StatsCalculator.calculateStreak(uniqueDates);

        // Breakdown by tradition
        const byTradition = {
            theravada: completedSessions.filter(s => s.tradition === 'theravada').length,
            mahayana: completedSessions.filter(s => s.tradition === 'mahayana').length
        };

        // Breakdown by Technique
        const byTechnique: { [key: string]: { sessions: number, totalMinutes: number } } = {};

        // Initialize from content to ensure all techniques are present
        content.sections.forEach(section => {
            byTechnique[section.id] = { sessions: 0, totalMinutes: 0 };
        });

        completedSessions.forEach(s => {
            const technique = s.focus; // 'focus' matches section.id
            if (!byTechnique[technique]) {
                byTechnique[technique] = { sessions: 0, totalMinutes: 0 };
            }
            byTechnique[technique].sessions++;
            byTechnique[technique].totalMinutes += s.durationMinutes;
        });

        return {
            totalSessions,
            totalMinutes,
            currentStreak,
            lastPracticeDate: uniqueDates.length > 0 ? uniqueDates[0] : null,
            byTradition,
            byTechnique
        };
    },

    getTodaySummary: async () => {
        const sessions = await EmptinessService.getSessions();
        const today = new Date().toISOString().split('T')[0];
        const todaySessions = sessions.filter(s => s.timestamp.startsWith(today));

        return {
            count: todaySessions.length,
            minutes: todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0)
        };
    }
};
