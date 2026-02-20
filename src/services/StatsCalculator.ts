export const StatsCalculator = {
    /**
     * Calculates the current streak from a list of ISO date strings.
     * Elements should be parseable dates.
     */
    calculateStreak(dateStrings: string[]): number {
        if (!dateStrings || dateStrings.length === 0) return 0;

        // Extract just the YYYY-MM-DD part and get unique days
        const uniqueDates = Array.from(new Set(
            dateStrings.map(d => d.split('T')[0])
        )).sort().reverse(); // Sort descending

        if (uniqueDates.length === 0) return 0;

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Streak must be active today or yesterday
        if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
            return 0;
        }

        let streak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
            const d1 = new Date(uniqueDates[i]);
            const d2 = new Date(uniqueDates[i + 1]);
            const diffTime = Math.abs(d1.getTime() - d2.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }
};
