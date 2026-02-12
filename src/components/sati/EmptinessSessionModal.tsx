import React, { useState, useEffect, useRef } from 'react';
import {
    IonModal, IonHeader, IonToolbar, IonButtons, IonButton,
    IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonRadioGroup, IonRadio, IonNote, IonRange, IonIcon,
    IonFooter
} from '@ionic/react';
import { play, close, timerOutline, musicalNotes, volumeHigh } from 'ionicons/icons';
import { EmptinessService } from '../../services/EmptinessService';
import { EmptinessSection, EmptinessSession } from '../../types/SatiTypes';
import { v4 as uuidv4 } from 'uuid';

interface EmptinessSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialFocus?: string; // id of the section
}

const EmptinessSessionModal: React.FC<EmptinessSessionModalProps> = ({ isOpen, onClose, initialFocus }) => {
    const [step, setStep] = useState<'setup' | 'running' | 'completed'>('setup');
    const [focusId, setFocusId] = useState<string>(initialFocus || 'anatta');
    const [duration, setDuration] = useState<number>(30);
    const [bellEnabled, setBellEnabled] = useState(true);

    // Running state
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [sessionData, setSessionData] = useState<any>(null);

    const data = EmptinessService.getContent();
    const sections = data.sections;
    const currentSection = sections.find(s => s.id === focusId);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            completeSession();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    useEffect(() => {
        if (isOpen) {
            setStep('setup');
            setFocusId(initialFocus || 'anatta');
            setIsActive(false);
        }
    }, [isOpen, initialFocus]);

    const startSession = () => {
        setTimeLeft(duration * 60);
        setIsActive(true);
        setStep('running');
        // Play start bell if enabled (mock for now)
        if (bellEnabled) console.log('🔔 Ding!');
    };

    const completeSession = () => {
        setIsActive(false);
        setStep('completed');
        // Play end bell
        if (bellEnabled) console.log('🔔 Ding! Ding!');

        if (!currentSection) return;

        const session: EmptinessSession = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            durationMinutes: duration,
            focus: focusId,
            tradition: currentSection.tradition,
            completed: true,
            tags: []
        };
        setSessionData(session);
        EmptinessService.saveSession(session);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const renderSetup = () => (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Start Session</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose}><IonIcon icon={close} /></IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList inset={true} style={{ borderRadius: '16px', background: 'var(--color-bg-card)', marginBottom: '24px' }}>
                    <IonRadioGroup value={focusId} onIonChange={e => setFocusId(e.detail.value)}>
                        <div style={{ padding: '16px 16px 8px', fontWeight: 'bold', color: '#666', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                            Theravada (Pali Canon)
                        </div>
                        {sections.filter(s => s.tradition === 'theravada').map(s => (
                            <IonItem key={s.id}>
                                <IonLabel>
                                    <h2>{s.title.en}</h2>
                                    <p style={{ fontSize: '0.8rem' }}>{s.title.pali}</p>
                                </IonLabel>
                                <IonRadio slot="start" value={s.id} />
                            </IonItem>
                        ))}

                        <div style={{ padding: '16px 16px 8px', fontWeight: 'bold', color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', marginTop: '8px' }}>
                            Mahayana
                        </div>
                        {sections.filter(s => s.tradition === 'mahayana').map(s => (
                            <IonItem key={s.id}>
                                <IonLabel>
                                    <h2>{s.title.en}</h2>
                                    <p style={{ fontSize: '0.8rem' }}>{s.title.sanskrit}</p>
                                </IonLabel>
                                <IonRadio slot="start" value={s.id} />
                            </IonItem>
                        ))}
                    </IonRadioGroup>
                </IonList>

                <div style={{ background: 'var(--color-bg-card)', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IonIcon icon={timerOutline} />
                            <span style={{ fontWeight: 'bold' }}>Duration</span>
                        </div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>{duration} min</span>
                    </div>
                    <IonRange
                        min={5} max={60} step={5} snaps={true}
                        value={duration}
                        onIonChange={e => setDuration(e.detail.value as number)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
                        <span>5m</span>
                        <span>30m</span>
                        <span>60m</span>
                    </div>
                </div>
            </IonContent>
            <IonFooter className="ion-no-border" style={{ padding: '16px' }}>
                <IonButton expand="block" onClick={startSession} style={{ borderRadius: '12px', height: '48px', fontWeight: 'bold', '--box-shadow': '0 4px 12px rgba(var(--ion-color-primary-rgb), 0.3)' }}>
                    <IonIcon slot="start" icon={play} />
                    Begin Session
                </IonButton>
            </IonFooter>
        </>
    );

    const renderRunning = () => (
        <IonContent fullscreen className="ion-text-center" style={{ '--background': '#111827', color: 'white' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ fontSize: '3rem', margin: '0 0 16px' }}>{currentSection?.icon}</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', margin: '0 0 8px' }}>
                        {currentSection?.title.en}
                    </h2>
                    <p style={{ color: '#9ca3af' }}>{currentSection?.title.pali || currentSection?.title.sanskrit}</p>
                </div>

                <div style={{ fontSize: '4rem', fontFamily: 'monospace', fontWeight: 'bold', color: '#FCD34D', marginBottom: '60px', textShadow: '0 0 20px rgba(252, 211, 77, 0.3)' }}>
                    {formatTime(timeLeft)}
                </div>

                <div style={{ width: '100%', maxWidth: '300px' }}>
                    <IonButton expand="block" color="medium" fill="outline" onClick={() => setStep('setup')}>
                        End Session
                    </IonButton>
                </div>
            </div>
        </IonContent>
    );

    const renderCompleted = () => (
        <>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonTitle>Session Complete</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" style={{ textAlign: 'center' }}>
                <div style={{ marginTop: '40px', marginBottom: '30px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>Well Done!</h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
                        You completed {duration} minutes of<br />
                        <span style={{ fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>{currentSection?.title.en}</span>
                    </p>
                </div>

                <IonButton expand="block" onClick={onClose} style={{ marginTop: '40px' }}>
                    Close
                </IonButton>
            </IonContent>
        </>
    );

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            {step === 'setup' && renderSetup()}
            {step === 'running' && renderRunning()}
            {step === 'completed' && renderCompleted()}
        </IonModal>
    );
};

export default EmptinessSessionModal;
