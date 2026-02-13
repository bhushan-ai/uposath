
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
}

const MarkObservedDialog: React.FC<MarkObservedDialogProps> = ({ isOpen, onClose, onSave, date }) => {
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
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Log Observance</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose}>Cancel</IonButton>
                        <IonButton strong onClick={handleSave}>Save</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="text-center mb-4">
                    <h2 className="text-lg font-bold">
                        {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h2>
                    <p className="text-sm text-gray-500">How was your Uposatha?</p>
                </div>

                <IonList inset>
                    <IonItem>
                        <IonSelect
                            label="Observance Level"
                            labelPlacement="floating"
                            value={level}
                            onIonChange={e => setLevel(e.detail.value)}
                        >
                            <IonSelectOption value="full">Full (All Day)</IonSelectOption>
                            <IonSelectOption value="partial">Partial (Half Day/Evening)</IonSelectOption>
                            <IonSelectOption value="minimal">Minimal (Symbolic)</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <div className="ion-padding-start ion-padding-top font-bold text-sm text-gray-600">
                        Practices
                    </div>
                    <IonItem lines="none">
                        <IonCheckbox
                            checked={precepts.includes('8_precepts')}
                            onIonChange={() => togglePrecept('8_precepts')}
                        >
                            8 Precepts
                        </IonCheckbox>
                    </IonItem>
                    <IonItem lines="none">
                        <IonCheckbox
                            checked={precepts.includes('monastery')}
                            onIonChange={() => togglePrecept('monastery')}
                        >
                            Visited Monastery / Temple
                        </IonCheckbox>
                    </IonItem>
                    <IonItem lines="none">
                        <IonCheckbox
                            checked={precepts.includes('study')}
                            onIonChange={() => togglePrecept('study')}
                        >
                            Dhamma Study / Discussion
                        </IonCheckbox>
                    </IonItem>

                    <div className="ion-padding-start ion-padding-top font-bold text-sm text-gray-600">
                        Time (Minutes)
                    </div>
                    <IonItem>
                        <IonInput
                            label="Meditation"
                            type="number"
                            placeholder="0"
                            value={meditation}
                            onIonChange={e => setMeditation(parseInt(e.detail.value || '0'))}
                        />
                    </IonItem>
                    <IonItem>
                        <IonInput
                            label="Chanting"
                            type="number"
                            placeholder="0"
                            value={chanting}
                            onIonChange={e => setChanting(parseInt(e.detail.value || '0'))}
                        />
                    </IonItem>
                    <IonItem>
                        <IonInput
                            label="Study/Reading"
                            type="number"
                            placeholder="0"
                            value={study}
                            onIonChange={e => setStudy(parseInt(e.detail.value || '0'))}
                        />
                    </IonItem>

                    <div className="ion-padding-start ion-padding-top font-bold text-sm text-gray-600">
                        Quality
                    </div>
                    <IonItem lines="none">
                        <div className="flex items-center justify-center w-full py-2">
                            {[1, 2, 3, 4, 5].map(starIdx => (
                                <IonIcon
                                    key={starIdx}
                                    icon={starIdx <= quality ? star : starOutline}
                                    style={{ fontSize: '2rem', color: '#F59E0B', margin: '0 4px' }}
                                    onClick={() => setQuality(starIdx)}
                                />
                            ))}
                        </div>
                    </IonItem>

                    <IonItem>
                        <IonTextarea
                            label="Reflection / Notes"
                            labelPlacement="floating"
                            rows={3}
                            value={reflection}
                            onIonChange={e => setReflection(e.detail.value || '')}
                        />
                    </IonItem>
                </IonList>
            </IonContent>
        </IonModal>
    );
};

export default MarkObservedDialog;
