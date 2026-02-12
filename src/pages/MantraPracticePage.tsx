import React, { useState, useEffect } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonButtons, IonButton,
    IonTitle, IonContent, IonIcon, useIonAlert, useIonToast,
    useIonViewWillEnter, IonProgressBar
} from '@ionic/react';
import { close, volumeHigh, volumeMute, pause, play } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { MantraService } from '../services/MantraService';
import { Mantra, MantraSession } from '../types/SatiTypes';
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
    const [presentAlert] = useIonAlert();

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
        } else {
            history.goBack();
        }
    };

    const handleComplete = async () => {
        setSessionState('completed');
        if (bellEnabled) {
            console.log('🔔 Ding!');
        }
        await saveSession();
    };

    const saveSession = async () => {
        if (!mantra) return;

        const durationMinutes = Math.ceil(elapsedSeconds / 60);
        const session: MantraSession = {
            id: crypto.randomUUID(),
            mantraId: mantra.id,
            timestamp: new Date().toISOString(),
            durationMinutes: durationMinutes,
            reps: count,
            completed: count >= mantra.practice.defaultReps
        };

        await MantraService.saveSession(session);

        presentAlert({
            header: 'Session Complete',
            subHeader: `${count} repetitions`,
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
    };

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
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

                        <div className="practice-mantra-text">
                            <p className="primary">{mantra.text.primaryText}</p>
                            {mantra.text.transliteration && (
                                <p className="secondary">{mantra.text.transliteration}</p>
                            )}
                        </div>

                        <div className="mala-container">
                            <MalaCounter
                                mode="active"
                                count={count}
                                target={mantra.practice.defaultReps}
                                onIncrement={() => {
                                    if (sessionState !== 'completed') {
                                        setCount(c => c + 1);
                                        if (sessionState === 'paused') setSessionState('running');
                                    }
                                }}
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

                            <IonButton color="medium" fill="clear" onClick={saveSession}>
                                End Session
                            </IonButton>
                        </div>
                    </>
                )}
            </IonContent>
        </IonPage>
    );
};

export default MantraPracticePage;
