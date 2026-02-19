declare module 'chinese-lunar-calendar' {
    interface LunarResult {
        lunarMonth: number;
        lunarDate: number;
        isLeap: boolean;
        solarTerm: string | null;
        lunarYear: string;
        zodiac: string;
        dateStr: string;
    }

    export function getLunar(year: number, month: number, date: number): LunarResult;
}
