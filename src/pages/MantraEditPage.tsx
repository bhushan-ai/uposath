import React, { useState } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
    IonTitle, IonContent, IonButton, IonItem, IonLabel, IonInput,
    IonSelect, IonSelectOption, IonTextarea, IonList, IonListHeader,
    IonIcon, useIonToast, useIonViewWillEnter, IonProgressBar
} from '@ionic/react';
import { settingsOutline, createOutline, leafOutline, statsChartOutline, trashOutline } from 'ionicons/icons';
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
                    <IonTitle style={{ fontWeight: 800, fontFamily: 'var(--font-family-display)', letterSpacing: '0.02em' }}>
                        {id === 'new' ? 'ADD MANTRA' : 'EDIT MANTRA'}
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave} className="save-button-header" disabled={!mantra}>
                            SAVE
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                {!mantra ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <IonProgressBar type="indeterminate" color="primary" />
                        <p style={{ marginTop: '20px', color: 'var(--color-text-tertiary)' }}>Gathering mantra details...</p>
                    </div>
                ) : (
                    <div className="ion-padding mantra-edit-container">

                        {/* Basic Info Section */}
                        <div className="edit-section">
                            <div className="edit-section-header">
                                <div className="icon-wrapper icon-wrapper--small icon-wrapper--primary">
                                    <IonIcon icon={settingsOutline} color="primary" />
                                </div>
                                <h3 className="edit-section-title">Basic Info</h3>
                            </div>
                            <div className="edit-glass-card">
                                <div className="input-group">
                                    <label className="input-label">Name *</label>
                                    <IonInput
                                        className="custom-input"
                                        value={mantra.basic.name}
                                        placeholder="e.g. Great Compassion Mantra"
                                        onIonChange={e => setMantra({ ...mantra, basic: { ...mantra.basic, name: e.detail.value! } })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Deity / Figure (Optional)</label>
                                    <IonInput
                                        className="custom-input"
                                        value={mantra.basic.deity}
                                        placeholder="e.g. Avalokiteśvara"
                                        onIonChange={e => setMantra({ ...mantra, basic: { ...mantra.basic, deity: e.detail.value! } })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Icon (Emoji)</label>
                                    <IonInput
                                        className="custom-input"
                                        value={mantra.basic.icon}
                                        placeholder="✨"
                                        onIonChange={e => setMantra({ ...mantra, basic: { ...mantra.basic, icon: e.detail.value! } })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mantra Text Section */}
                        <div className="edit-section">
                            <div className="edit-section-header">
                                <div className="icon-wrapper icon-wrapper--small icon-wrapper--primary">
                                    <IonIcon icon={createOutline} color="primary" />
                                </div>
                                <h3 className="edit-section-title">Mantra Text</h3>
                            </div>
                            <div className="edit-glass-card">
                                <div className="input-group">
                                    <label className="input-label">Primary Script</label>
                                    <IonSelect
                                        className="custom-select"
                                        interface="popover"
                                        value={mantra.text.primaryScript}
                                        onIonChange={e => setMantra({ ...mantra, text: { ...mantra.text, primaryScript: e.detail.value! } })}
                                    >
                                        <IonSelectOption value="devanagari">Devanagari</IonSelectOption>
                                        <IonSelectOption value="roman">Roman (IAST)</IonSelectOption>
                                        <IonSelectOption value="tibetan">Tibetan</IonSelectOption>
                                        <IonSelectOption value="chinese">Chinese</IonSelectOption>
                                        <IonSelectOption value="thai">Thai</IonSelectOption>
                                    </IonSelect>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Mantra Text *</label>
                                    <IonTextarea
                                        className="custom-textarea"
                                        rows={4}
                                        value={mantra.text.primaryText}
                                        placeholder="Enter mantra text here..."
                                        onIonChange={e => setMantra({ ...mantra, text: { ...mantra.text, primaryText: e.detail.value! } })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Transliteration (Optional)</label>
                                    <IonTextarea
                                        className="custom-textarea"
                                        rows={2}
                                        value={mantra.text.transliteration}
                                        placeholder="Romanized text..."
                                        onIonChange={e => setMantra({ ...mantra, text: { ...mantra.text, transliteration: e.detail.value! } })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Context Section */}
                        <div className="edit-section">
                            <div className="edit-section-header">
                                <div className="icon-wrapper icon-wrapper--small icon-wrapper--primary">
                                    <IonIcon icon={leafOutline} color="primary" />
                                </div>
                                <h3 className="edit-section-title">Context</h3>
                            </div>
                            <div className="edit-glass-card">
                                <div className="input-group">
                                    <label className="input-label">Tradition</label>
                                    <IonSelect
                                        className="custom-select"
                                        interface="popover"
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
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Purpose (Optional)</label>
                                    <IonInput
                                        className="custom-input"
                                        value={mantra.purpose}
                                        placeholder="e.g. Compassion, Healing"
                                        onIonChange={e => setMantra({ ...mantra, purpose: e.detail.value! })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Practice Defaults */}
                        <div className="edit-section">
                            <div className="edit-section-header">
                                <div className="icon-wrapper icon-wrapper--small icon-wrapper--primary">
                                    <IonIcon icon={statsChartOutline} color="primary" />
                                </div>
                                <h3 className="edit-section-title">Practice Defaults</h3>
                            </div>
                            <div className="edit-glass-card">
                                <div className="practice-grid">
                                    <div className="input-group">
                                        <label className="input-label">Target Beads</label>
                                        <IonInput
                                            className="custom-input"
                                            type="number"
                                            value={mantra.practice.defaultReps}
                                            onIonChange={e => setMantra({ ...mantra, practice: { ...mantra.practice, defaultReps: parseInt(e.detail.value!, 10) } })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Duration (Min)</label>
                                        <IonInput
                                            className="custom-input"
                                            type="number"
                                            value={mantra.practice.defaultDurationMinutes}
                                            onIonChange={e => setMantra({ ...mantra, practice: { ...mantra.practice, defaultDurationMinutes: parseInt(e.detail.value!, 10) } })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {id !== 'new' && (
                            <div className="delete-container">
                                <IonButton
                                    expand="block"
                                    fill="outline"
                                    className="delete-button-brutal"
                                    onClick={handleDelete}
                                >
                                    <IonIcon slot="start" icon={trashOutline} />
                                    Delete Mantra
                                </IonButton>
                            </div>
                        )}
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default MantraEditPage;
