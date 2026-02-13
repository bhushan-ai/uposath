
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
}

const MarkSkippedDialog: React.FC<MarkSkippedDialogProps> = ({ isOpen, onClose, onSave, date }) => {
    const [reason, setReason] = useState<string>('work');
    const [note, setNote] = useState<string>('');

    const handleSave = () => {
        onSave({
            status: 'skipped',
            skipReason: reason as any,
            skipNote: note,
            date: date.toISOString().split('T')[0]
        });
        onClose();
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} initialBreakpoint={0.5} breakpoints={[0, 0.5, 0.75]}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Skip Uposatha</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose}>Cancel</IonButton>
                        <IonButton strong color="warning" onClick={handleSave}>Confirm</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="text-center mb-4">
                    <h2 className="text-lg font-bold">
                        {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h2>
                    <p className="text-sm text-gray-500">Life happens. What prevented observance today?</p>
                </div>

                <IonList inset>
                    <IonItem>
                        <IonSelect
                            label="Reason"
                            labelPlacement="floating"
                            value={reason}
                            onIonChange={e => setReason(e.detail.value)}
                        >
                            <IonSelectOption value="work">Work / Busy</IonSelectOption>
                            <IonSelectOption value="travel">Traveling</IonSelectOption>
                            <IonSelectOption value="health">Health / Illness</IonSelectOption>
                            <IonSelectOption value="forgot">Forgot</IonSelectOption>
                            <IonSelectOption value="other">Other</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem>
                        <IonTextarea
                            label="Note (Optional)"
                            labelPlacement="floating"
                            rows={3}
                            value={note}
                            onIonChange={e => setNote(e.detail.value || '')}
                        />
                    </IonItem>
                </IonList>
            </IonContent>
        </IonModal>
    );
};

export default MarkSkippedDialog;
