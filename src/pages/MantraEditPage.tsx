import React, { useState } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
    IonTitle, IonContent, IonButton, IonItem, IonLabel, IonInput,
    IonSelect, IonSelectOption, IonTextarea, IonList, IonListHeader,
    IonIcon, useIonToast, useIonViewWillEnter, IonProgressBar
} from '@ionic/react';
import { trash } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { MantraService } from '../services/MantraService';
import { Mantra, MantraTradition } from '../types/SatiTypes';
import './MantraEditPage.css';

const MantraEditPage: React.FC = () => {
    const history = useHistory();
    const { id } = useParams<{ id: string }>();
    const [mantra, setMantra] = useState<Mantra | null>(null);
    const [present] = useIonToast();

    useIonViewWillEnter(() => {
        loadData();
    });

    const loadData = async () => {
        if (id === 'new') {
            setMantra(MantraService.createNewMantra());
        } else {
            const mantras = await MantraService.getMantras();
            const found = mantras.find(m => m.id === id);
            if (found) {
                setMantra(found);
            } else {
                present('Mantra not found', 2000);
                history.goBack();
            }
        }
    };

    const handleSave = async () => {
        if (!mantra) return;
        if (!mantra.basic.name) {
            present('Please enter a name', 2000);
            return;
        }

        if (id === 'new') {
            await MantraService.addMantra({
                ...mantra,
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            });
        } else {
            await MantraService.updateMantra({
                ...mantra,
                updated: new Date().toISOString()
            });
        }

        history.goBack();
    };

    const handleDelete = async () => {
        if (id !== 'new') {
            await MantraService.deleteMantra(id);
            history.goBack();
        }
    }

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/sati/mantras" />
                    </IonButtons>
                    <IonTitle>{id === 'new' ? 'Add Mantra' : 'Edit Mantra'}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave} strong={true} disabled={!mantra}>
                            Save
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                {!mantra ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <IonProgressBar type="indeterminate" />
                        <p style={{ marginTop: '10px' }}>Loading mantra...</p>
                    </div>
                ) : (
                    <>
                        <IonList inset={true}>
                            <IonListHeader>
                                <IonLabel>Basic Info</IonLabel>
                            </IonListHeader>
                            <IonItem>
                                <IonLabel position="stacked">Name *</IonLabel>
                                <IonInput
                                    value={mantra.basic.name}
                                    placeholder="e.g. Great Compassion Mantra"
                                    onIonChange={e => setMantra({ ...mantra, basic: { ...mantra.basic, name: e.detail.value! } })}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Deity / Figure (Optional)</IonLabel>
                                <IonInput
                                    value={mantra.basic.deity}
                                    placeholder="e.g. Avalokiteśvara"
                                    onIonChange={e => setMantra({ ...mantra, basic: { ...mantra.basic, deity: e.detail.value! } })}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Icon (Emoji)</IonLabel>
                                <IonInput
                                    value={mantra.basic.icon}
                                    onIonChange={e => setMantra({ ...mantra, basic: { ...mantra.basic, icon: e.detail.value! } })}
                                />
                            </IonItem>
                        </IonList>

                        <IonList inset={true}>
                            <IonListHeader>
                                <IonLabel>Mantra Text</IonLabel>
                            </IonListHeader>
                            <IonItem>
                                <IonLabel position="stacked">Primary Script</IonLabel>
                                <IonSelect
                                    value={mantra.text.primaryScript}
                                    onIonChange={e => setMantra({ ...mantra, text: { ...mantra.text, primaryScript: e.detail.value! } })}
                                >
                                    <IonSelectOption value="devanagari">Devanagari</IonSelectOption>
                                    <IonSelectOption value="roman">Roman (IAST)</IonSelectOption>
                                    <IonSelectOption value="tibetan">Tibetan</IonSelectOption>
                                    <IonSelectOption value="chinese">Chinese</IonSelectOption>
                                    <IonSelectOption value="thai">Thai</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Mantra Text *</IonLabel>
                                <IonTextarea
                                    rows={3}
                                    value={mantra.text.primaryText}
                                    placeholder="Enter mantra text here..."
                                    onIonChange={e => setMantra({ ...mantra, text: { ...mantra.text, primaryText: e.detail.value! } })}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Transliteration (Optional)</IonLabel>
                                <IonTextarea
                                    rows={2}
                                    value={mantra.text.transliteration}
                                    placeholder="Romanized text..."
                                    onIonChange={e => setMantra({ ...mantra, text: { ...mantra.text, transliteration: e.detail.value! } })}
                                />
                            </IonItem>
                        </IonList>

                        <IonList inset={true}>
                            <IonListHeader>
                                <IonLabel>Context</IonLabel>
                            </IonListHeader>
                            <IonItem>
                                <IonLabel position="stacked">Tradition</IonLabel>
                                <IonSelect
                                    value={mantra.tradition}
                                    onIonChange={e => setMantra({ ...mantra, tradition: e.detail.value as MantraTradition })}
                                >
                                    <IonSelectOption value="mahayana">Mahayana</IonSelectOption>
                                    <IonSelectOption value="theravada">Theravada</IonSelectOption>
                                    <IonSelectOption value="tibetan">Tibetan</IonSelectOption>
                                    <IonSelectOption value="zen">Zen</IonSelectOption>
                                    <IonSelectOption value="pureland">Pure Land</IonSelectOption>
                                    <IonSelectOption value="hindu">Hindu</IonSelectOption>
                                    <IonSelectOption value="custom">Custom / Other</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Purpose (Optional)</IonLabel>
                                <IonInput
                                    value={mantra.purpose}
                                    placeholder="e.g. Compassion, Healing"
                                    onIonChange={e => setMantra({ ...mantra, purpose: e.detail.value! })}
                                />
                            </IonItem>
                        </IonList>

                        <IonList inset={true}>
                            <IonListHeader>
                                <IonLabel>Practice Defaults</IonLabel>
                            </IonListHeader>
                            <IonItem>
                                <IonLabel position="stacked">Target Repetitions</IonLabel>
                                <IonInput
                                    type="number"
                                    value={mantra.practice.defaultReps}
                                    onIonChange={e => setMantra({ ...mantra, practice: { ...mantra.practice, defaultReps: parseInt(e.detail.value!, 10) } })}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Duration (Minutes)</IonLabel>
                                <IonInput
                                    type="number"
                                    value={mantra.practice.defaultDurationMinutes}
                                    onIonChange={e => setMantra({ ...mantra, practice: { ...mantra.practice, defaultDurationMinutes: parseInt(e.detail.value!, 10) } })}
                                />
                            </IonItem>
                        </IonList>

                        {id !== 'new' && (
                            <div style={{ padding: '20px' }}>
                                <IonButton expand="block" color="danger" fill="outline" onClick={handleDelete}>
                                    <IonIcon slot="start" icon={trash} />
                                    Delete Mantra
                                </IonButton>
                            </div>
                        )}
                    </>
                )}
            </IonContent>
        </IonPage>
    );
};

export default MantraEditPage;
