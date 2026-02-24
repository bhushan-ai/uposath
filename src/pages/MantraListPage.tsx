import React, { useState } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
    IonTitle, IonContent, IonButton, IonIcon, IonFab, IonFabButton,
    useIonViewWillEnter, useIonActionSheet
} from '@ionic/react';
import { add, play, star, cameraOutline, createOutline, trashOutline, bookOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { MantraService } from '../services/MantraService';
import { MalaService } from '../services/MalaService';
import { deityImageService } from '../services/DeityImageService';
import { imagePickerService } from '../services/ImagePickerService';
import { PaliTransliterator } from '../services/PaliTransliterator';
import { Mantra, SatiPreferences, DEFAULT_PREFERENCES } from '../types/SatiTypes';
import DailyRoutineRef from '../components/sati/DailyRoutineRef';
import './MantraListPage.css';

const MantraListPage: React.FC = () => {
    const history = useHistory();
    const [mantras, setMantras] = useState<Mantra[]>([]);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});
    const [prefs, setPrefs] = useState<SatiPreferences>(DEFAULT_PREFERENCES);
    const [showRoutine, setShowRoutine] = useState(false);
    const [presentActionSheet] = useIonActionSheet();
    const pressTimer = React.useRef<NodeJS.Timeout | null>(null);
    const isLongPress = React.useRef(false);

    const loadData = async () => {
        const data = await MantraService.getMantras();

        // Sort: Pinned first, then by creation date descending
        data.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            const timeA = new Date(a.created).getTime();
            const timeB = new Date(b.created).getTime();
            return timeB - timeA;
        });

        setMantras(data);

        const imgMap: Record<string, string> = {};
        for (const m of data) {
            imgMap[m.id] = await deityImageService.getDeityImageSrc(m);
        }
        setImageMap(imgMap);

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

    const handleLongPress = (mantra: Mantra) => {
        presentActionSheet({
            header: mantra.basic.name,
            buttons: [
                {
                    text: 'Start Practice',
                    icon: play,
                    handler: () => history.push(`/sati/mantras/practice/${mantra.id}`)
                },
                {
                    text: 'Edit Mantra',
                    icon: createOutline,
                    handler: () => history.push(`/sati/mantras/edit/${mantra.id}`)
                },
                {
                    text: 'Change Deity Image',
                    icon: cameraOutline,
                    handler: async () => {
                        const oldPath = mantra.basic.deityImageType === 'user' ? mantra.basic.deityImagePath : undefined;
                        try {
                            const newPath = await imagePickerService.pickAndSaveDeityImage(mantra.id, oldPath);
                            if (newPath) {
                                const updatedMantra = { ...mantra };
                                updatedMantra.basic.deityImageType = 'user';
                                updatedMantra.basic.deityImagePath = newPath;
                                updatedMantra.basic.deityKey = undefined;
                                await MantraService.updateMantra(updatedMantra);
                                await loadData();
                            }
                        } catch (err) {
                            console.error("Camera change failed", err);
                        }
                    }
                },
                {
                    text: mantra.isPinned ? 'Unpin' : 'Pin to Top',
                    icon: star,
                    handler: async () => {
                        const updatedMantra = { ...mantra, isPinned: !mantra.isPinned };
                        await MantraService.updateMantra(updatedMantra);
                        await loadData();
                    }
                },
                {
                    text: 'Delete Mantra',
                    role: 'destructive',
                    icon: trashOutline,
                    handler: async () => {
                        await MantraService.deleteMantra(mantra.id);
                        await loadData();
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
    };

    const startPress = (mantra: Mantra) => {
        isLongPress.current = false;
        pressTimer.current = setTimeout(() => {
            isLongPress.current = true;
            handleLongPress(mantra);
        }, 500);
    };

    const cancelPress = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
    };

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/sati" />
                    </IonButtons>
                    <IonTitle>Custom Mantras</IonTitle>
                    <IonButtons slot="end">
                        <IonButton
                            onClick={() => setShowRoutine(!showRoutine)}
                            className={`guidance-btn ${showRoutine ? "guidance-btn-active" : ""}`}
                        >
                            <IonIcon slot="start" icon={bookOutline} className="btn-icon-pulse" />
                            Guidance
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                <div className="mantra-list-header">
                    <h1>My Mantras</h1>
                    <p>Personal collection</p>
                </div>

                {showRoutine && (
                    <DailyRoutineRef onClose={() => setShowRoutine(false)} />
                )}

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
                        {mantras.map((mantra, index) => (
                            <div
                                key={mantra.id}
                                className="mantra-card"
                                onTouchStart={() => startPress(mantra)}
                                onTouchEnd={cancelPress}
                                onMouseDown={() => startPress(mantra)}
                                onMouseUp={cancelPress}
                                onMouseLeave={cancelPress}
                                onClick={() => {
                                    if (isLongPress.current) {
                                        isLongPress.current = false;
                                        return;
                                    }
                                    history.push(`/sati/mantras/practice/${mantra.id}`);
                                }}
                                style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
                            >
                                <div className="card-left-panel">
                                    <img src={imageMap[mantra.id]} alt={mantra.basic.name} />
                                    <div
                                        className="camera-overlay"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            const oldPath = mantra.basic.deityImageType === 'user' ? mantra.basic.deityImagePath : undefined;
                                            try {
                                                const newPath = await imagePickerService.pickAndSaveDeityImage(mantra.id, oldPath);
                                                if (newPath) {
                                                    // Update mantra JSON and save, then reload
                                                    const updatedMantra = { ...mantra };
                                                    updatedMantra.basic.deityImageType = 'user';
                                                    updatedMantra.basic.deityImagePath = newPath;
                                                    updatedMantra.basic.deityKey = undefined;
                                                    await MantraService.updateMantra(updatedMantra);
                                                    await loadData();
                                                }
                                            } catch (err) {
                                                console.error("Camera change failed", err);
                                            }
                                        }}
                                    >
                                        <IonIcon icon={cameraOutline} />
                                    </div>
                                </div>
                                <div className="card-right-column">
                                    <div className="card-top-section">
                                        <div className="title-row">
                                            <h3 className="mantra-title">{mantra.basic.name}</h3>
                                            {mantra.isPinned && <IonIcon icon={star} className="pin-icon" />}
                                        </div>
                                        {mantra.basic.deity && (
                                            <div className="deity-pill">
                                                <span className="dot">●</span> {mantra.basic.deity}
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-middle-section">
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
                                    </div>

                                    <div className="card-stats-row">
                                        <div className="stat-item">◎ {mantra.stats.totalReps} beads</div>
                                        <div className="stat-item">⏱ {mantra.stats.totalSessions} sessions</div>
                                    </div>

                                    <div className="card-bottom-actions">
                                        <IonButton
                                            size="small"
                                            fill="clear"
                                            className="edit-btn-text"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                history.push(`/sati/mantras/edit/${mantra.id}`);
                                            }}
                                        >
                                            EDIT
                                        </IonButton>
                                        <IonButton size="small" fill="solid" className="practice-btn-pill">
                                            PRACTICE <IonIcon slot="end" icon={play} size="small" />
                                        </IonButton>
                                    </div>
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
