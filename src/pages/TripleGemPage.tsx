
import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonBackButton
} from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import { AVAILABLE_LANGUAGES, AVAILABLE_SCRIPTS, getTripleGemData, getLocalizedText, getPaliScriptText } from '../services/TripleGemService';
import { SatiPreferences, DEFAULT_PREFERENCES } from '../types/SatiTypes';
import { MalaService } from '../services/MalaService';
import TripleGemCard from '../components/sati/TripleGemCard';
import './TripleGemPage.css';

const TripleGemPage: React.FC = () => {
    const [prefs, setPrefs] = useState<SatiPreferences>(DEFAULT_PREFERENCES);
    const data = getTripleGemData();

    // Initial load
    useEffect(() => {
        const load = async () => {
            const p = await MalaService.getPreferences();
            setPrefs(p);
        };
        load();
    }, []);

    // Handlers for header dropdowns
    const handleScriptChange = (e: CustomEvent) => {
        const newScript = e.detail.value;
        const newPrefs = { ...prefs, paliScript: newScript };
        setPrefs(newPrefs);
        MalaService.savePreferences(newPrefs);
    };

    const handleLanguageChange = (e: CustomEvent) => {
        const newLang = e.detail.value;
        const newPrefs = { ...prefs, translationLanguage: newLang };
        setPrefs(newPrefs);
        MalaService.savePreferences(newPrefs);
    };

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/sati" />
                    </IonButtons>
                    <IonTitle>Triple Gem</IonTitle>
                    <IonButtons slot="end">
                        <IonButton routerLink="/settings">
                            <IonIcon icon={ellipsisVertical} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                {/* Preferences Control Row */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '20px',
                    padding: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px'
                }}>
                    <IonSelect
                        value={prefs.paliScript}
                        interface="action-sheet"
                        onIonChange={handleScriptChange}
                        className="toggle-button"
                        style={{ '--background': 'var(--color-bg-secondary)', width: 'auto' }}
                        placeholder="Script"
                    >
                        {AVAILABLE_SCRIPTS.map(s => (
                            <IonSelectOption key={s.code} value={s.code}>
                                {s.label}
                            </IonSelectOption>
                        ))}
                    </IonSelect>

                    <IonSelect
                        value={prefs.translationLanguage}
                        interface="action-sheet"
                        onIonChange={handleLanguageChange}
                        className="toggle-button"
                        style={{ '--background': 'var(--color-bg-secondary)', width: 'auto' }}
                        placeholder="Language"
                    >
                        {AVAILABLE_LANGUAGES.map(l => (
                            <IonSelectOption key={l.code} value={l.code}>
                                {l.label}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                </div>

                {/* Title Section */}
                <div className="triple-gem-header-card">
                    <h1 className="triple-gem-title">
                        {getLocalizedText(data.title, prefs.translationLanguage)}
                    </h1>
                    <p className="triple-gem-subtitle">
                        {getPaliScriptText(data.subtitle, prefs.paliScript)}
                    </p>
                </div>

                {/* Triple Gem Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.recollections.map(rec => (
                        <TripleGemCard
                            key={`${rec.id}-${prefs.translationLanguage}-${prefs.paliScript}`}
                            recollection={rec}
                            prefs={prefs}
                        />
                    ))}
                </div>

                <div style={{ height: '40px' }} />
            </IonContent>
        </IonPage>
    );
};

export default TripleGemPage;
