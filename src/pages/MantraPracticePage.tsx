import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonButtons, IonButton,
    IonTitle, IonContent, IonIcon, useIonAlert,
    useIonViewWillEnter, IonProgressBar,
    IonSegment, IonSegmentButton, IonLabel
} from '@ionic/react';
import { close, volumeHigh, volumeMute, pause, play, add, remove } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { MantraService } from '../services/MantraService';
import { MalaService } from '../services/MalaService';
import { PaliTransliterator } from '../services/PaliTransliterator';
import { Mantra, MantraSession, SatiPreferences, DEFAULT_PREFERENCES } from '../types/SatiTypes';
import MalaCounter from '../components/sati/MalaCounter';
import './MantraPracticePage.css';

const MantraPracticePage: React.FC = () => {
    const history = useHistory();
    const { id } = useParams<{ id: string }>();
    const [mantra, setMantra] = useState<Mantra | null>(null);
    const [count, setCount] = useState(0);
    const [sessionState, setSessionState] = useState<'running' | 'paused' | 'completed'>('running');
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [bellEnabled, setBellEnabled] = useState(true);
    const [prefs, setPrefs] = useState<SatiPreferences>(DEFAULT_PREFERENCES);
    const [presentAlert] = useIonAlert();

    // New state for Manual Mode & History
    const [practiceMode, setPracticeMode] = useState<'interactive' | 'manual'>('interactive');
    const [manualCount, setManualCount] = useState(108);
    const [isLogging, setIsLogging] = useState(false);
    const [todaySessions, setTodaySessions] = useState<MantraSession[]>([]);

    useIonViewWillEnter(() => {
        loadData();
    });

    useEffect(() => {
        let interval: any;
        if (sessionState === 'running') {
            interval = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [sessionState]);

    const loadData = async () => {
        const mantras = await MantraService.getMantras();
        const found = mantras.find(m => m.id === id);
        if (found) {
            setMantra(found);
            setBellEnabled(found.practice.bellAtCompletion);

            // Only set manual count if it hasn't been touched or is default (optional logic, keeping simple for now)
            if (manualCount === 108 && found.practice.defaultReps !== 108) {
                setManualCount(found.practice.defaultReps);
            }
        } else {
            history.goBack();
            return;
        }

        // Load sessions for history
        const allSessions = await MantraService.getSessions();
        const todayStr = new Date().toISOString().split('T')[0];
        const todays = allSessions.filter(s =>
            s.mantraId === id &&
            s.timestamp.startsWith(todayStr)
        ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setTodaySessions(todays);

        const p = await MalaService.getPreferences();
        setPrefs(p);
    };

    const handleManualLog = async () => {
        if (!mantra || manualCount <= 0) return;
        setIsLogging(true);

        const session: MantraSession = {
            id: crypto.randomUUID(),
            mantraId: mantra.id,
            timestamp: new Date().toISOString(),
            durationMinutes: 0, // Manual logs don't track duration precisely
            reps: manualCount,
            completed: manualCount >= mantra.practice.defaultReps
        };

        await MantraService.saveSession(session);
        setIsLogging(false);
        setManualCount(mantra.practice.defaultReps); // Reset to default

        presentAlert({
            header: 'Session Logged',
            message: `Logged ${manualCount} beads.`,
            buttons: ['OK']
        });

        await loadData(); // Refresh stats and history
    };

    const isCompletedRef = useRef(false);
    const isSaving = useRef(false);
    const saveSessionInternal = useCallback(async () => {
        if (!mantra || isSaving.current) return;
        isSaving.current = true;

        const durationMinutes = Math.ceil(elapsedSeconds / 60);
        const session: MantraSession = {
            id: crypto.randomUUID(),
            mantraId: mantra.id,
            timestamp: new Date().toISOString(),
            durationMinutes: durationMinutes,
            reps: count,
            completed: count >= mantra.practice.defaultReps
        };

        try {
            await MantraService.saveSession(session);
            await loadData(); // Refresh stats

            presentAlert({
                header: 'Session Complete',
                subHeader: `${count} beads`,
                message: `Duration: ${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`,
                buttons: [
                    {
                        text: 'Done',
                        role: 'confirm',
                        handler: () => {
                            history.goBack();
                        }
                    }
                ]
            });
        } catch (err) {
            console.error('Failed to save session:', err);
            isSaving.current = false;
            isCompletedRef.current = false; // Allow retry
        } finally {
            isSaving.current = false;
        }
    }, [mantra, elapsedSeconds, count, history, presentAlert, loadData]);

    const handleComplete = useCallback(async () => {
        if (sessionState === 'completed' || isCompletedRef.current) return;
        isCompletedRef.current = true;

        setSessionState('completed');
        if (bellEnabled) {
            console.log('🔔 Ding!');
        }
        await saveSessionInternal();
    }, [sessionState, bellEnabled, saveSessionInternal]);

    const handleIncrement = useCallback(() => {
        if (sessionState !== 'completed') {
            setCount(c => c + 1);
            if (sessionState === 'paused') setSessionState('running');
        }
    }, [sessionState]);

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Helper to transliterate if script is not roman
    const getDisplayText = (text: string) => {
        if (!text) return '';
        if (prefs.paliScript === 'roman') return text;
        return PaliTransliterator.transliterate(text, prefs.paliScript as any);
    };

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => history.goBack()}>
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Practice</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setBellEnabled(!bellEnabled)}>
                            <IonIcon icon={bellEnabled ? volumeHigh : volumeMute} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="practice-content">
                {!mantra ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <IonProgressBar type="indeterminate" />
                        <p style={{ marginTop: '20px', color: 'var(--color-text-secondary)' }}>Preparing your practice...</p>
                    </div>
                ) : (
                    <>
                        <div className="practice-header">
                            <div className="practice-icon">{mantra.basic.icon}</div>
                            {mantra.basic.deity && <h2 className="practice-deity">{mantra.basic.deity}</h2>}
                            <h3 className="practice-name">{mantra.basic.name}</h3>
                        </div>

                        {/* Mode Switcher */}
                        <div className="practice-segment-wrap">
                            <IonSegment value={practiceMode} onIonChange={e => setPracticeMode(e.detail.value as any)}>
                                <IonSegmentButton value="interactive">
                                    <IonLabel>Interactive</IonLabel>
                                </IonSegmentButton>
                                <IonSegmentButton value="manual">
                                    <IonLabel>Manual Log</IonLabel>
                                </IonSegmentButton>
                            </IonSegment>
                        </div>

                        <div className="practice-mantra-text">
                            <p className="primary" style={{
                                fontFamily: prefs.paliScript === 'roman' ? 'inherit' : 'sans-serif',
                                fontSize: prefs.paliScript === 'roman' ? '1.5rem' : '1.6rem'
                            }}>
                                {getDisplayText(mantra.text.primaryText)}
                            </p>
                            {mantra.text.transliteration && (
                                <p className="secondary">{getDisplayText(mantra.text.transliteration)}</p>
                            )}
                        </div>

                        {practiceMode === 'interactive' ? (
                            <>
                                <div className="mala-container">
                                    <MalaCounter
                                        mode="active"
                                        count={count}
                                        target={mantra.practice.defaultReps}
                                        onIncrement={handleIncrement}
                                        onComplete={handleComplete}
                                        haptic={true}
                                        bell={bellEnabled}
                                    />
                                </div>

                                <div className="timer-display">
                                    ⏱️ {formatTime(elapsedSeconds)}
                                </div>

                                <div className="controls">
                                    {sessionState === 'running' ? (
                                        <IonButton fill="outline" onClick={() => setSessionState('paused')}>
                                            <IonIcon slot="start" icon={pause} /> Pause
                                        </IonButton>
                                    ) : sessionState === 'paused' ? (
                                        <IonButton fill="outline" onClick={() => setSessionState('running')}>
                                            <IonIcon slot="start" icon={play} /> Resume
                                        </IonButton>
                                    ) : (
                                        <IonButton disabled>Completed</IonButton>
                                    )}

                                    <IonButton color="medium" fill="clear" onClick={saveSessionInternal}>
                                        End Session
                                    </IonButton>
                                </div>
                            </>
                        ) : (
                            <div className="glass-card manual-log-card">
                                <h4>Log Beads</h4>

                                {/* Stats pills */}
                                <div className="manual-stats-row">
                                    <div className="manual-stat-pill">
                                        Streak: <strong>{mantra.stats.currentStreak} days</strong> 🔥
                                    </div>
                                    <div className="manual-stat-pill">
                                        Total: <strong>{mantra.stats.totalReps.toLocaleString()}</strong>
                                    </div>
                                </div>

                                {/* Bead stepper */}
                                <div className="manual-stepper">
                                    <button className="manual-stepper__btn" onClick={() => setManualCount(Math.max(1, manualCount - 1))}>
                                        <IonIcon icon={remove} />
                                    </button>

                                    <div className="manual-stepper__value">
                                        {manualCount}
                                    </div>

                                    <button className="manual-stepper__btn" onClick={() => setManualCount(manualCount + 1)}>
                                        <IonIcon icon={add} />
                                    </button>

                                    <button
                                        className={`manual-log-btn${isLogging ? ' manual-log-btn--loading' : ''}`}
                                        onClick={handleManualLog}
                                        disabled={isLogging}
                                    >
                                        {isLogging ? 'Logging…' : 'Log Session'}
                                    </button>
                                </div>

                                {/* Quick Buttons */}
                                {prefs && prefs.quickButtons && (
                                    <div className="manual-quick-btns">
                                        {prefs.quickButtons.map(amount => (
                                            <button
                                                key={amount}
                                                className="manual-quick-btn"
                                                onClick={() => setManualCount(amount)}
                                            >
                                                {amount}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Today's Sessions */}
                                {todaySessions.length > 0 && (
                                    <div className="manual-session-list">
                                        <div className="manual-session-list__heading">Today's Sessions</div>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {todaySessions.map(session => (
                                                <li key={session.id} className="manual-session-item">
                                                    <span className="manual-session-item__time">
                                                        {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="manual-session-item__beads">
                                                        {session.reps} beads
                                                    </span>
                                                </li>
                                            ))}
                                            <li className="manual-session-item manual-session-item--total">
                                                <span>Total Today</span>
                                                <span>{todaySessions.reduce((sum, s) => sum + s.reps, 0)}</span>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </IonContent>
        </IonPage>
    );
};

export default MantraPracticePage;
