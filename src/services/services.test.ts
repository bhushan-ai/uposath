import { describe, it, expect, vi } from 'vitest';
import { getUposathaStatus, getMonthUposathaDays } from './uposathaCalculator';
import { checkFestival, getUpcomingFestivals } from './buddhistFestivalService';
import { computeHoras } from './horaCalculator';
import { Observer, getPanchangam } from '@ishubhamx/panchangam-js';

// Gaya, Bihar
const observer = new Observer(24.7914, 85.0002, 111);

describe('Uposatha Calculator', () => {
    it('correctly identifies Full Moon (Purnima) on Vesak 2026', () => {
        // Vesak 2026 is on May 31
        const date = new Date('2026-05-31T06:00:00');
        const status = getUposathaStatus(date, observer);

        expect(status.isUposatha).toBe(true);
        expect(status.isFullMoon).toBe(true);
        expect(status.tithiNumber).toBe(15);
        expect(status.paksha).toBe('Shukla');
    });

    it('correctly identifies New Moon (Amavasya) on Diwali 2026', () => {
        // Diwali 2026 is on Nov 8 (Kartika Amavasya)
        const date = new Date('2026-11-08T06:00:00');
        const status = getUposathaStatus(date, observer);

        // Note: If tithi changes slightly after sunrise, it might be the previous day.
        // But usually Diwali is on the Amavasya night, so sunrise on 8th or 9th?
        // Let's check the month of Nov 2026 to be sure.
        const days = getMonthUposathaDays(2026, 10, observer); // Nov (10)
        const amavasya = days.find(d => d.status.isNewMoon);

        expect(amavasya).toBeDefined();
        if (amavasya) {
            expect(amavasya.status.isUposatha).toBe(true);
            expect(amavasya.status.tithiNumber).toBe(30);
            expect(amavasya.status.paksha).toBe('Krishna');
        }
    });

    it('correctly identifies 8th day (Ashtami)', () => {
        // In May 2026 (Purnima May 31), Ashtami (8th) should be around May 23-24
        const days = getMonthUposathaDays(2026, 4, observer);
        const ashtami = days.find(d => d.status.isAshtami);

        expect(ashtami).toBeDefined();
        if (ashtami) {
            expect(ashtami.status.isUposatha).toBe(true);
            // Shukla 8 (8) or Krishna 8 (23)
            // Since Purnima is end of month, we likely find Shukla 8 first
            expect([8, 23]).toContain(ashtami.status.tithiNumber);
        }
    });

    it('returns non-Uposatha for random days', () => {
        // May 13, 2026 should be Krishna Prathama (Day 16) - not Uposatha
        const date = new Date('2026-05-13T12:00:00');
        const status = getUposathaStatus(date, observer);
        expect(status.isUposatha).toBe(false);
    });
});

describe('Buddhist Festival Service', () => {
    it('detects Vesak 2026', () => {
        // Purnima of Vaishakha month
        const date = new Date('2026-05-01T06:00:00');

        // We need to confirm if May 01 is indeed Vaishakha Purnima.
        // In 2026, Chaitra starts ~March 20. Vaishakha starts ~April 19.
        // So May 01 is Vaishakha Purnima.
        const festival = checkFestival(date, observer);

        // Debug logging
        const p = getPanchangam(date, observer);
        console.log(`Date: ${date.toISOString()}`);
        console.log(`Masa: ${p.masa.name}, Index: ${p.masa.index}, Adhika: ${p.masa.isAdhika}`);
        console.log(`Tithi: ${p.tithi}`);

        expect(festival).not.toBeNull();
        expect(festival?.id).toBe('vesak');
        expect(festival?.name).toContain('Vesak');
    });

    it('does NOT detect Hindu festivals', () => {
        // Diwali 2026 is around Nov 8 (Kartika Amavasya).
        // Let's find Amavasya of Kartika.
        // Nov 2026.
        const days = getMonthUposathaDays(2026, 10, observer); // Nov
        const amavasya = days.find(d => d.status.isNewMoon);

        if (amavasya) {
            const festival = checkFestival(amavasya.date, observer);
            expect(festival).toBeNull(); // Should NOT return Diwali
        }
    });
});

describe('Hora Calculator', () => {
    it('calculates 24 horas for a day', () => {
        const date = new Date('2026-05-12T06:00:00'); // Tuesday
        const horas = computeHoras(date, observer);

        expect(horas.length).toBe(24);

        // Check first and last
        expect(horas[0].horaNumber).toBe(1);
        expect(horas[23].horaNumber).toBe(24);

        // Check day/night split
        const dayHoras = horas.filter(h => h.isDayHora);
        const nightHoras = horas.filter(h => !h.isDayHora);
        expect(dayHoras.length).toBe(12);
        expect(nightHoras.length).toBe(12);
    });

    it('starts with correct ruler for weekday', () => {
        // May 12, 2026 is a Tuesday.
        // Tuesday ruler is Mars.
        const date = new Date('2026-05-12T06:00:00');
        const horas = computeHoras(date, observer);

        expect(horas[0].planet).toBe('Mars');

        // Sequence check: Mars -> Sun -> Venus...
        expect(horas[1].planet).toBe('Sun');
        expect(horas[2].planet).toBe('Venus');
    });
});
