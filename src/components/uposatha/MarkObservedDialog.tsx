
import React, { useState } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonInput,
    IonTextarea,
    IonRange,
    IonIcon,
    IonNote
} from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';
import { UposathaObservance } from '../../types/ObservanceTypes';

interface MarkObservedDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<UposathaObservance>) => void;
    date: Date;
    tithi?: string;
}

const MarkObservedDialog: React.FC<MarkObservedDialogProps> = ({ isOpen, onClose, onSave, date, tithi }) => {
    const [level, setLevel] = useState<'full' | 'partial' | 'minimal'>('full');
    const [precepts, setPrecepts] = useState<string[]>(['8_precepts']);
    const [meditation, setMeditation] = useState<number>(0);
    const [chanting, setChanting] = useState<number>(0);
    const [study, setStudy] = useState<number>(0);
    const [quality, setQuality] = useState<number>(3);
    const [reflection, setReflection] = useState<string>('');

    const handleSave = () => {
        onSave({
            status: 'observed',
            level,
            precepts,
            practiceMinutes: { meditation, chanting, study },
            quality,
            reflection,
            tithi,
            date: date.toISOString().split('T')[0]
        });
        onClose();
    };

    const togglePrecept = (val: string) => {
        if (precepts.includes(val)) {
            setPrecepts(precepts.filter(p => p !== val));
        } else {
            setPrecepts([...precepts, val]);
        }
    };

    return (
        <IonModal
            isOpen={isOpen}
            onDidDismiss={onClose}
            style={{ '--background': 'transparent', '--border-radius': '24px' }}
            className="glass-modal"
        >
            <IonHeader className="ion-no-border">
                <IonToolbar style={{ '--background': 'transparent', padding: '12px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', color: 'var(--color-text-primary)' }}>Log Observance</h3>
                        <IonButtons>
                            <IonButton onClick={onClose} color="medium" style={{ fontWeight: '600' }}>CANCEL</IonButton>
                            <IonButton onClick={handleSave} style={{ fontWeight: '800', '--color': 'var(--ion-color-primary)' }}>SAVE</IonButton>
                        </IonButtons>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" style={{ '--background': 'transparent' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-accent-primary)', marginBottom: '4px' }}>
                        {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>
                        How was your spiritual practice today?
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '20px' }}>

                    {/* Level Selection Section */}
                    <div style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '20px',
                        padding: '16px',
                        backdropFilter: 'var(--glass-backdrop)'
                    }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                            Observance Intensity
                        </div>
                        <IonSelect
                            mode="ios"
                            interface="action-sheet"
                            value={level}
                            onIonChange={e => setLevel(e.detail.value)}
                            style={{
                                width: '100%',
                                '--background': 'transparent',
                                color: 'var(--color-text-primary)',
                                fontWeight: '700'
                            }}
                        >
                            <IonSelectOption value="full">🌕 Full (All Day & Precepts)</IonSelectOption>
                            <IonSelectOption value="partial">🌗 Partial (Half Day/Evening)</IonSelectOption>
                            <IonSelectOption value="minimal">🌑 Minimal (Symbolic/Intentional)</IonSelectOption>
                        </IonSelect>
                    </div>

                    {/* Practices Section */}
                    <div style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '20px',
                        padding: '16px',
                        backdropFilter: 'var(--glass-backdrop)'
                    }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                            Practices Fulfilled
                        </div>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {[
                                { id: '8_precepts', label: '8 Precepts Observed', icon: '📝' },
                                { id: 'monastery', label: 'Monastery / Temple Visit', icon: '🏛️' },
                                { id: 'study', label: 'Dhamma Study / Reading', icon: '📖' }
                            ].map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => togglePrecept(item.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px 14px',
                                        background: precepts.includes(item.id) ? 'rgba(255, 198, 112, 0.1)' : 'rgba(255,255,255,0.03)',
                                        borderRadius: '14px',
                                        border: `1px solid ${precepts.includes(item.id) ? 'var(--color-accent-primary)' : 'transparent'}`,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                                        <span style={{ fontWeight: '600', color: precepts.includes(item.id) ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                                            {item.label}
                                        </span>
                                    </div>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '6px',
                                        border: '2px solid var(--color-accent-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: precepts.includes(item.id) ? 'var(--color-accent-primary)' : 'transparent'
                                    }}>
                                        {precepts.includes(item.id) && <span style={{ color: 'black', fontSize: '0.7rem', fontWeight: '900' }}>✓</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Time Tracking Section */}
                    <div style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '20px',
                        padding: '16px',
                        backdropFilter: 'var(--glass-backdrop)'
                    }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                            Time Commitment (Min)
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            {[
                                { label: 'Meditation', value: meditation, setter: setMeditation },
                                { label: 'Chanting', value: chanting, setter: setChanting },
                                { label: 'Study', value: study, setter: setStudy }
                            ].map(item => (
                                <div key={item.label} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>{item.label}</div>
                                    <input
                                        type="number"
                                        value={item.value || ''}
                                        onChange={e => item.setter(parseInt(e.target.value || '0'))}
                                        placeholder="0"
                                        style={{
                                            width: '100%',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '12px',
                                            padding: '10px 4px',
                                            textAlign: 'center',
                                            color: 'var(--color-text-primary)',
                                            fontWeight: '800',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quality Section */}
                    <div style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '20px',
                        padding: '16px',
                        backdropFilter: 'var(--glass-backdrop)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                            Overall Quality
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            {[1, 2, 3, 4, 5].map(starIdx => (
                                <IonIcon
                                    key={starIdx}
                                    icon={starIdx <= quality ? star : starOutline}
                                    style={{
                                        fontSize: '2.2rem',
                                        color: starIdx <= quality ? 'var(--color-accent-primary)' : 'var(--color-text-tertiary)',
                                        opacity: starIdx <= quality ? 1 : 0.4,
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => setQuality(starIdx)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Reflection Section */}
                    <div style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '20px',
                        padding: '16px',
                        backdropFilter: 'var(--glass-backdrop)'
                    }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                            Reflections & Insights
                        </div>
                        <textarea
                            rows={3}
                            value={reflection}
                            onChange={e => setReflection(e.target.value)}
                            placeholder="How do you feel after today's practice?"
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid var(--glass-border)',
                                color: 'var(--color-text-primary)',
                                fontWeight: '500',
                                outline: 'none',
                                resize: 'none',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>
                </div>
                <div style={{ height: '40px' }} />
            </IonContent>
        </IonModal>
    );
};

export default MarkObservedDialog;
