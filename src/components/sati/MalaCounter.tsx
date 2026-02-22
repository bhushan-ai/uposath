import React, { useState, useEffect } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { add, remove } from 'ionicons/icons';
import { MalaService } from '../../services/MalaService';
import { MalaEntry, SatiPreferences, PracticeType, PracticeStats } from '../../types/SatiTypes';
import './MalaCounter.css';

interface MalaCounterProps {
    practiceType?: PracticeType;
    prefs?: SatiPreferences;
    mode?: 'logging' | 'active';
    count?: number;
    target?: number;
    onIncrement?: () => void;
    onComplete?: () => void;
    haptic?: boolean;
    bell?: boolean;
}

const MalaCounter: React.FC<MalaCounterProps> = ({
    practiceType = 'buddha',
    prefs,
    mode = 'logging',
    count = 0,
    target = 108,
    onIncrement,
    onComplete,
    haptic = true,
    bell = true
}) => {
    const [beadsInput, setBeadsInput] = useState<number>(108);
    const [todayTotal, setTodayTotal] = useState<number>(0);
    const [todaySessions, setTodaySessions] = useState<MalaEntry[]>([]);
    const [stats, setStats] = useState<PracticeStats | null>(null);
    const [isLogging, setIsLogging] = useState(false);
    const [ripple, setRipple] = useState(false);

    // For active mode haptics
    useEffect(() => {
        if (mode === 'active' && count > 0 && haptic) {
            if (navigator.vibrate) navigator.vibrate(10);
        }

        // Completion check with guard
        if (mode === 'active' && count >= target && onComplete) {
            onComplete();
        }
    }, [count, mode, haptic, target, onComplete]);

    const loadData = async () => {
        if (mode !== 'logging') return;
        const entries = await MalaService.getEntries();
        const allStats = await MalaService.getStats();

        const todayStr = new Date().toISOString().split('T')[0];
        const todays = entries.filter(e =>
            e.timestamp.startsWith(todayStr) &&
            (e.practiceType || 'buddha') === practiceType
        );

        const total = todays.reduce((sum, e) => sum + e.beads, 0);

        setTodaySessions(todays);
        setTodayTotal(total);

        if (allStats.byType && allStats.byType[practiceType]) {
            setStats(allStats.byType[practiceType]);
        }
    };

    useEffect(() => {
        loadData();
    }, [practiceType, mode]);

    const handleQuickAdd = (amount: number) => {
        setBeadsInput(amount);
    };

    const adjustInput = (delta: number) => {
        setBeadsInput(Math.max(1, beadsInput + delta));
    };

    const logPractice = async () => {
        if (beadsInput <= 0) return;
        setIsLogging(true);

        const newEntry: MalaEntry = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            beads: beadsInput,
            practiceType: practiceType
        };

        await MalaService.saveEntry(newEntry);
        await loadData();

        setBeadsInput(108);
        setIsLogging(false);
    };

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    const handleTap = () => {
        if (!onIncrement) return;
        setRipple(true);
        setTimeout(() => setRipple(false), 350);
        onIncrement();
    };

    if (mode === 'active') {
        const progress = Math.min(100, (count / target) * 100);
        const circumference = 2 * Math.PI * 126;
        const dashOffset = circumference * (1 - progress / 100);
        const isComplete = count >= target;

        return (
            <div className="mala-active-wrapper">
                <div
                    className={`mala-disc${ripple ? ' mala-disc--ripple' : ''}${isComplete ? ' mala-disc--complete' : ''}`}
                    onClick={handleTap}
                >
                    {/* Outer SVG ring */}
                    <svg className="mala-ring-svg" viewBox="0 0 268 268">
                        {/* Track */}
                        <circle
                            cx="134" cy="134" r="126"
                            fill="transparent"
                            stroke="rgba(255,198,112,0.08)"
                            strokeWidth="10"
                        />
                        {/* Progress */}
                        <circle
                            cx="134" cy="134" r="126"
                            fill="transparent"
                            stroke={isComplete ? '#6bcf7f' : 'var(--color-accent-primary)'}
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            className="mala-ring-progress"
                            style={{
                                filter: isComplete
                                    ? 'drop-shadow(0 0 10px rgba(107,207,127,0.6))'
                                    : 'drop-shadow(0 0 10px rgba(255,198,112,0.5))'
                            }}
                        />
                    </svg>

                    {/* Inner disc */}
                    <div className="mala-disc-inner">
                        <div className={`mala-count-number${isComplete ? ' mala-count-number--complete' : ''}`}>
                            {isComplete ? '✓' : count}
                        </div>
                        {!isComplete && (
                            <div className="mala-count-hint">tap</div>
                        )}
                    </div>
                </div>

                <div className="mala-meta">
                    <div className="mala-target-label">
                        TARGET: <span className="mala-target-value">{target}</span>
                    </div>
                    <div className="mala-tap-hint">Tap center to increment</div>
                </div>
            </div>
        );
    }

    return (
        <div className="mala-log-card glass-card">
            <h4 className="mala-log-title">
                {capitalize(practiceType)} Mala Practice
            </h4>

            {stats && (
                <div className="mala-stats-row">
                    <div className="mala-stat-badge">
                        <span className="mala-stat-badge__icon">🔥</span>
                        <span className="mala-stat-badge__value">{stats.currentStreak}</span>
                        <span className="mala-stat-badge__label">day streak</span>
                    </div>
                    <div className="mala-stat-badge">
                        <span className="mala-stat-badge__icon">📿</span>
                        <span className="mala-stat-badge__value">{stats.totalBeads.toLocaleString()}</span>
                        <span className="mala-stat-badge__label">total</span>
                    </div>
                </div>
            )}

            <div className="mala-stepper">
                <button className="mala-stepper__btn" onClick={() => adjustInput(-1)}>
                    <IonIcon icon={remove} />
                </button>

                <div className="mala-stepper__value">
                    {beadsInput}
                </div>

                <button className="mala-stepper__btn" onClick={() => adjustInput(1)}>
                    <IonIcon icon={add} />
                </button>

                <button
                    className={`mala-log-btn${isLogging ? ' mala-log-btn--loading' : ''}`}
                    onClick={logPractice}
                    disabled={isLogging}
                >
                    {isLogging ? 'Logging…' : 'Log Practice'}
                </button>
            </div>

            {prefs && prefs.quickButtons && (
                <div className="mala-quick-btns">
                    {prefs.quickButtons.map(amount => (
                        <button
                            key={amount}
                            className="mala-quick-btn"
                            onClick={() => handleQuickAdd(amount)}
                        >
                            {amount}
                        </button>
                    ))}
                </div>
            )}

            {todaySessions.length > 0 && (
                <div className="mala-session-list">
                    <div className="mala-session-list__heading">Today's Sessions</div>
                    <ul className="mala-session-list__items">
                        {todaySessions.map(session => (
                            <li key={session.id} className="mala-session-item">
                                <span className="mala-session-item__time">
                                    {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="mala-session-item__beads">
                                    {session.beads} beads
                                </span>
                            </li>
                        ))}
                        <li className="mala-session-item mala-session-item--total">
                            <span>Total Today</span>
                            <span>{todayTotal}</span>
                        </li>
                    </ul>
                </div>
            )}

            <div className="mala-stats-link">
                <IonButton fill="clear" size="small" routerLink="/sati/stats">
                    View Detailed Statistics →
                </IonButton>
            </div>
        </div>
    );
};

export default MalaCounter;
