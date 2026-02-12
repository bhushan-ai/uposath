import React, { useState } from 'react';
import { IonIcon, IonButton } from '@ionic/react';
import { chevronDown, chevronUp } from 'ionicons/icons';
import { Recollection, SatiPreferences, PracticeType } from '../../types/SatiTypes';
import { getLocalizedText, getPaliScriptText } from '../../services/TripleGemService';
import MalaCounter from './MalaCounter';

interface TripleGemCardProps {
    recollection: Recollection;
    prefs: SatiPreferences;
}

import '../../pages/TripleGemPage.css';

const TripleGemCard: React.FC<TripleGemCardProps> = ({ recollection, prefs }) => {
    const [showTranslation, setShowTranslation] = useState(prefs.showTranslations);
    const [showQualities, setShowQualities] = useState(false);

    const title = getLocalizedText(recollection.title, prefs.translationLanguage);
    const verse = getPaliScriptText(recollection.verse, prefs.paliScript);
    const translation = getLocalizedText(recollection.translation, prefs.translationLanguage);

    const toggleTranslation = () => setShowTranslation(!showTranslation);
    const toggleQualities = () => setShowQualities(!showQualities);

    const getFontSize = () => {
        switch (prefs.paliTextSize) {
            case 'small': return '1.1rem';
            case 'large': return '1.4rem';
            case 'xl': return '1.6rem';
            default: return '1.25rem';
        }
    };

    return (
        <div className="triple-gem-card">
            {/* Header */}
            <div className="triple-gem-header" style={{ borderLeft: `6px solid ${recollection.color}` }}>
                <div className="triple-gem-icon">{recollection.icon}</div>
                <div>
                    <h3 style={{ margin: 0 }}>{getPaliScriptText(recollection.title, prefs.paliScript)}</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '0.9rem', color: 'var(--color-text-secondary, #6b7280)' }}>
                        {getLocalizedText(recollection.title, prefs.translationLanguage)}
                    </p>
                </div>
            </div>

            <div className="triple-gem-content">
                {/* Pali Verse */}
                <div
                    className="verse-display"
                    style={{
                        fontSize: getFontSize(),
                        fontFamily: prefs.paliScript === 'roman' ? '"Noto Serif", serif' : 'inherit'
                    }}
                >
                    {verse}
                </div>

                {/* Main Toggles */}
                <div className="action-row">
                    <IonButton
                        className="toggle-button"
                        fill="clear"
                        size="small"
                        onClick={toggleTranslation}
                    >
                        {showTranslation ? 'Hide Translation' : 'Show Translation'}
                        <IonIcon slot="end" icon={showTranslation ? chevronUp : chevronDown} />
                    </IonButton>

                    <IonButton
                        className="toggle-button"
                        fill="clear"
                        size="small"
                        onClick={toggleQualities}
                    >
                        {showQualities ? 'Hide Qualities' : `${recollection.qualities.length} Qualities`}
                        <IonIcon slot="end" icon={showQualities ? chevronUp : chevronDown} />
                    </IonButton>
                </div>

                {/* Translation Content */}
                {showTranslation && (
                    <div className="translation-panel" style={{ borderLeftColor: recollection.color }}>
                        <p className="translation-text">
                            {translation}
                        </p>
                    </div>
                )}

                {/* Qualities Content */}
                {showQualities && (
                    <div className="qualities-panel">
                        <h4 className="qualities-title">
                            Key Qualities
                        </h4>
                        {recollection.qualities.map(q => (
                            <div key={q.number} className="quality-item">
                                <div className="quality-header">
                                    <span className="quality-number">{q.number}.</span>
                                    <span className="quality-pali">{getPaliScriptText(q.pali, prefs.paliScript)}</span>
                                    <span className="quality-name"> — {getLocalizedText(q.name, prefs.translationLanguage)}</span>
                                </div>
                                <p className="quality-explanation">
                                    {getLocalizedText(q.explanation, prefs.translationLanguage)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Mala Counter Integration */}
                <div style={{ marginTop: '24px' }}>
                    <MalaCounter
                        practiceType={recollection.id as PracticeType}
                        prefs={prefs}
                    />
                </div>
            </div>
        </div>
    );
};

// Helper to access script text inside component if not passed as prop
const getTypeScriptText = (obj: any, script: string) => {
    return getPaliScriptText(obj, script);
};

export default TripleGemCard;
