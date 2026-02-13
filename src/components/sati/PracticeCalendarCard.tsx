import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { flame, chevronForward } from 'ionicons/icons';
import { MalaService } from '../../services/MalaService';
import { AnapanasatiService } from '../../services/AnapanasatiService';
import { MantraService } from '../../services/MantraService';
import { EmptinessService } from '../../services/EmptinessService';
import { getUposathaStatus } from '../../services/uposathaCalculator';
import { Observer } from '@ishubhamx/panchangam-js';
import { getSavedLocation } from '../../services/locationManager';

const PracticeCalendarCard: React.FC = () => {
    const history = useHistory();
    const [stats, setStats] = useState({
        mala: 0,
        mantra: 0,
        meditation: 0,
        sessions: 0
    });
    const [streak, setStreak] = useState<number>(0);
    const [isUposatha, setIsUposatha] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        // Load Uposatha status first
        const loc = await getSavedLocation();
        const observer = loc ? new Observer(loc.latitude, loc.longitude, loc.altitude) : new Observer(24.7914, 85.0002, 111);
        const status = getUposathaStatus(new Date(), observer);
        setIsUposatha(status.isUposatha);

        // Load today's stats for all practices
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Mala (Beads)
        const malaEntries = await MalaService.getEntries();
        const todayMala = malaEntries.filter(e => new Date(e.timestamp) >= today);
        const malaBeads = todayMala.reduce((acc, e) => acc + e.beads, 0);

        // 2. Mantra (Beads)
        const mantraSessions = await MantraService.getSessions();
        const todayMantra = mantraSessions.filter(s => new Date(s.timestamp) >= today);
        const mantraBeads = todayMantra.reduce((acc, s) => acc + s.reps, 0);

        // 3. Meditation (Minutes) - Anapanasati + Emptiness
        const anaSessions = await AnapanasatiService.getSessions();
        const todayAna = anaSessions.filter(s => new Date(s.timestamp) >= today);
        const anaMins = todayAna.reduce((acc, s) => acc + s.durationMinutes, 0);

        const empSessions = await EmptinessService.getSessions();
        const todayEmp = empSessions.filter(s => new Date(s.timestamp) >= today);
        const empMins = todayEmp.reduce((acc, s) => acc + s.durationMinutes, 0);

        const totalMeditation = anaMins + empMins;

        // 4. Total Sessions
        const totalSessions = todayMala.length + todayMantra.length + todayAna.length + todayEmp.length;

        // Streak (from MalaService or SatiStatsService - assuming shared logic or using Mala as proxy for now)
        // Ideally we should use SatiStatsService.getGlobalStats() for the unified streak
        const malaStats = await MalaService.getStats();
        // For now, let's use the mala streak or if unified service exists use that.
        // SatiStatsService is imported in current file? No. Let's stick to Mala as a proxy 
        // or check if SatiStatsService can be added?
        // Let's assume user wants unified streak. But for now, using existing pattern.
        setStreak(malaStats.overall.currentStreak);

        setStats({
            mala: malaBeads,
            mantra: mantraBeads,
            meditation: totalMeditation,
            sessions: totalSessions
        });

        setIsVisible(true);
    };

    if (!isVisible) return null;

    return (
        <div
            className={`practice-card ${isUposatha ? 'uposatha-glow' : ''}`}
            onClick={() => history.push('/sati')}
        >
            <div style={{ padding: 'var(--space-lg)' }}>
                <div className="practice-header">
                    <div className="practice-title">
                        <span>🙏</span> Sati Practice
                    </div>
                    {streak > 0 ? (
                        <div className="practice-streak">
                            {streak} <IonIcon icon={flame} />
                        </div>
                    ) : null}
                </div>

                <div className="practice-stats-grid">
                    <div className="practice-stat-item">
                        <span className="practice-stat-value" style={{ color: '#F59E0B' }}>{stats.mala}</span>
                        <span className="practice-stat-label">Tiratana</span>
                    </div>
                    <div className="practice-stat-item">
                        <span className="practice-stat-value" style={{ color: '#7C3AED' }}>{stats.mantra}</span>
                        <span className="practice-stat-label">Mantra</span>
                    </div>
                    <div className="practice-stat-item">
                        <span className="practice-stat-value" style={{ color: '#10B981' }}>{stats.meditation}m</span>
                        <span className="practice-stat-label">Meditate</span>
                    </div>
                    <div className="practice-stat-item" style={{ background: 'rgba(0,0,0,0.04)' }}>
                        <span className="practice-stat-value">{stats.sessions}</span>
                        <span className="practice-stat-label">Total</span>
                    </div>
                </div>

                <div className="practice-footer">
                    <div className="practice-total">
                        Today's Progress
                    </div>
                    <div className="practice-action">
                        {stats.sessions > 0 ? 'Continue' : 'Start Practice'} <IonIcon icon={chevronForward} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PracticeCalendarCard;
