import React, { useState } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
    IonTitle, IonContent, IonButton, IonIcon, IonFab, IonFabButton,
    useIonViewWillEnter
} from '@ionic/react';
import { add, play } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { MantraService } from '../services/MantraService';
import { MalaService } from '../services/MalaService';
import { PaliTransliterator } from '../services/PaliTransliterator';
import { Mantra, SatiPreferences, DEFAULT_PREFERENCES } from '../types/SatiTypes';
import './MantraListPage.css';

const MantraListPage: React.FC = () => {
    const history = useHistory();
    const [mantras, setMantras] = useState<Mantra[]>([]);
    const [prefs, setPrefs] = useState<SatiPreferences>(DEFAULT_PREFERENCES);

    const loadData = async () => {
        const data = await MantraService.getMantras();
        setMantras(data);
        const p = await MalaService.getPreferences();
        setPrefs(p);
    };

    useIonViewWillEnter(() => {
        loadData();
    });

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
                        <IonBackButton defaultHref="/sati" />
                    </IonButtons>
                    <IonTitle>Custom Mantras</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                <div className="mantra-list-header">
                    <h1>My Mantras</h1>
                    <p>Personal collection</p>
                </div>

                {mantras.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📿</div>
                        <h3>No mantras yet</h3>
                        <p>Add your first mantra to start practicing.</p>
                        <IonButton onClick={() => history.push('/sati/mantras/edit/new')} fill="outline">
                            Add Mantra
                        </IonButton>
                    </div>
                ) : (
                    <div className="mantra-grid">
                        {mantras.map(mantra => (
                            <div key={mantra.id} className="mantra-card" onClick={() => history.push(`/sati/mantras/practice/${mantra.id}`)}>
                                <div className="card-top">
                                    <div className="mantra-icon">{mantra.basic.icon}</div>
                                    <div className="mantra-info">
                                        <h3>{mantra.basic.name}</h3>
                                        {mantra.basic.deity && <p className="deity">{mantra.basic.deity}</p>}
                                    </div>
                                </div>

                                <div className="mantra-preview-text" style={{
                                    fontFamily: prefs.paliScript === 'roman' ? 'inherit' : 'sans-serif'
                                }}>
                                    {getDisplayText(mantra.text.primaryText)}
                                </div>
                                <div className="mantra-transliteration" style={{
                                    fontFamily: prefs.paliScript === 'roman' ? 'inherit' : 'sans-serif'
                                }}>
                                    {getDisplayText(mantra.text.transliteration || '')}
                                </div>

                                <div className="card-stats">
                                    <span>{mantra.stats.totalReps} reps</span>
                                    <span>•</span>
                                    <span>{mantra.stats.totalSessions} sessions</span>
                                </div>

                                <div className="card-actions">
                                    <IonButton
                                        size="small"
                                        fill="clear"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            history.push(`/sati/mantras/edit/${mantra.id}`);
                                        }}
                                    >
                                        Edit
                                    </IonButton>
                                    <IonButton size="small" fill="solid" className="practice-btn">
                                        Practice <IonIcon slot="end" icon={play} size="small" />
                                    </IonButton>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => history.push('/sati/mantras/edit/new')}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default MantraListPage;
