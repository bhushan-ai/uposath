
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
    IonTextarea
} from '@ionic/react';
import { UposathaObservance } from '../../types/ObservanceTypes';

interface MarkSkippedDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<UposathaObservance>) => void;
    date: Date;
    tithi?: string;
}

const MarkSkippedDialog: React.FC<MarkSkippedDialogProps> = ({ isOpen, onClose, onSave, date, tithi }) => {
    const [reason, setReason] = useState<string>('work');
    const [note, setNote] = useState<string>('');

    const handleSave = () => {
        onSave({
            status: 'skipped',
            skipReason: reason as any,
            skipNote: note,
            tithi,
            date: date.toISOString().split('T')[0]
        });
        onClose();
    };

    return (
        <IonModal
            isOpen={isOpen}
            onDidDismiss={onClose}
            initialBreakpoint={0.6}
            breakpoints={[0, 0.6, 0.8]}
            style={{ '--background': 'transparent', '--border-radius': '24px' }}
            className="glass-modal"
        >
            <IonHeader className="ion-no-border">
                <IonToolbar style={{ '--background': 'transparent', padding: '12px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', color: 'var(--color-text-primary)' }}>Skip Uposatha</h3>
                        <IonButtons>
                            <IonButton onClick={onClose} color="medium" style={{ fontWeight: '600' }}>CANCEL</IonButton>
                            <IonButton onClick={handleSave} style={{ fontWeight: '800', '--color': '#EF4444' }}>CONFIRM</IonButton>
                        </IonButtons>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" style={{ '--background': 'transparent' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                        {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>
                        Life happens. What prevented observance today?
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '20px' }}>
                    {/* Reason Selection */}
                    <div style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '20px',
                        padding: '16px',
                        backdropFilter: 'var(--glass-backdrop)'
                    }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                            Primary Reason
                        </div>
                        <IonSelect
                            mode="ios"
                            interface="action-sheet"
                            value={reason}
                            onIonChange={e => setReason(e.detail.value)}
                            style={{
                                width: '100%',
                                '--background': 'transparent',
                                color: 'var(--color-text-primary)',
                                fontWeight: '700'
                            }}
                        >
                            <IonSelectOption value="work">💼 Work / Busy</IonSelectOption>
                            <IonSelectOption value="travel">✈️ Traveling</IonSelectOption>
                            <IonSelectOption value="health">🤒 Health / Illness</IonSelectOption>
                            <IonSelectOption value="forgot">🧠 Forgot</IonSelectOption>
                            <IonSelectOption value="other">⚙️ Other</IonSelectOption>
                        </IonSelect>
                    </div>

                    {/* Note Input */}
                    <div style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '20px',
                        padding: '16px',
                        backdropFilter: 'var(--glass-backdrop)'
                    }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                            Additional Context (Optional)
                        </div>
                        <textarea
                            rows={3}
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder="Add a brief note about why it was skipped..."
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
            </IonContent>
        </IonModal>
    );
};

export default MarkSkippedDialog;
