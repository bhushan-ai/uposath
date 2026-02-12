import React, { useState } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
    IonTitle, IonContent, IonButton, IonIcon, IonFab, IonFabButton,
    useIonViewWillEnter
} from '@ionic/react';
import { add, settingsOutline, play } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { MantraService } from '../services/MantraService';
import { Mantra } from '../types/SatiTypes';
import './MantraListPage.css';

const MantraListPage: React.FC = () => {
    const history = useHistory();
    const [mantras, setMantras] = useState<Mantra[]>([]);

    const loadData = async () => {
        const data = await MantraService.getMantras();
        setMantras(data);
    };

    useIonViewWillEnter(() => {
        loadData();
    });

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/sati" />
                    </IonButtons>
                    <IonTitle>Custom Mantras</IonTitle>
                    <IonButtons slot="end">
                        <IonButton>
                            <IonIcon icon={settingsOutline} />
                        </IonButton>
                    </IonButtons>
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

                                <div className="mantra-preview-text">
                                    {mantra.text.primaryText}
                                </div>
                                <div className="mantra-transliteration">
                                    {mantra.text.transliteration}
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
