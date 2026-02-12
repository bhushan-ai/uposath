import React, { useState, useEffect } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
    IonTitle, IonContent, IonButton, IonIcon
} from '@ionic/react';
import { play, bookOutline, timeOutline, chevronDown, chevronUp, warningOutline } from 'ionicons/icons';
import { EmptinessService } from '../services/EmptinessService';
import EmptinessSessionModal from '../components/sati/EmptinessSessionModal';
import { EmptinessSection, EmptinessStats } from '../types/SatiTypes';
import './EmptinessPage.css';

const EmptinessPage: React.FC = () => {
    const [stats, setStats] = useState<EmptinessStats | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState<string[]>([]);

    const content = EmptinessService.getContent();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const s = await EmptinessService.getStats();
        setStats(s);
    };

    const toggleSection = (id: string) => {
        if (expandedSections.includes(id)) {
            setExpandedSections(expandedSections.filter(s => s !== id));
        } else {
            setExpandedSections([...expandedSections, id]);
        }
    };

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/sati" />
                    </IonButtons>
                    <IonTitle>Suññatā</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                <div className="emptiness-header">
                    <h1>{content.title.pali}</h1>
                    <p>{content.title.en}</p>
                </div>

                {/* Theravada Sections */}
                <div className="tradition-header">THERAVADA (Pali Canon)</div>

                {content.sections.filter(s => s.tradition === 'theravada').map(section => (
                    <div key={section.id} className="content-card">
                        <div
                            className="card-header"
                            onClick={() => toggleSection(section.id)}
                            style={{ borderLeft: `6px solid ${section.color}` }}
                        >
                            <div className="card-icon">{section.icon}</div>
                            <div className="card-title-group">
                                <h3>{section.title.en}</h3>
                                <p>{section.title.pali}</p>
                            </div>
                            <IonIcon icon={expandedSections.includes(section.id) ? chevronUp : chevronDown} />
                        </div>

                        {expandedSections.includes(section.id) && (
                            <div className="card-body">
                                <div className="source-tag">Source: {section.source.reference}</div>
                                {section.steps.map(step => (
                                    <div key={step.number} className="step-item">
                                        <div className="step-num">{step.number}</div>
                                        <div className="step-content">
                                            <h4>{step.title.en}</h4>
                                            <p className="pali-text">{step.pali}</p>
                                            <p className="translation">{step.translation.en}</p>
                                            <div className="guidance">
                                                <span>💡</span> {step.guidance.en}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Mahayana Sections */}
                <div className="tradition-header" style={{ marginTop: '32px' }}>MAHAYANA</div>

                {content.sections.filter(s => s.tradition === 'mahayana').map(section => (
                    <div key={section.id} className="content-card">
                        <div
                            className="card-header"
                            onClick={() => toggleSection(section.id)}
                            style={{ borderLeft: `6px solid ${section.color}` }}
                        >
                            <div className="card-icon">{section.icon}</div>
                            <div className="card-title-group">
                                <h3>{section.title.en}</h3>
                                <p>{section.title.sanskrit}</p>
                            </div>
                            <IonIcon icon={expandedSections.includes(section.id) ? chevronUp : chevronDown} />
                        </div>

                        {expandedSections.includes(section.id) && (
                            <div className="card-body">
                                {section.disclaimer && (
                                    <div className="disclaimer-box">
                                        <IonIcon icon={warningOutline} />
                                        <p>{section.disclaimer.en}</p>
                                    </div>
                                )}
                                <div className="source-tag">Source: {section.source.reference}</div>
                                {section.steps.map(step => (
                                    <div key={step.number} className="step-item">
                                        <div className="step-num">{step.number}</div>
                                        <div className="step-content">
                                            <h4>{step.title.en}</h4>
                                            <p className="pali-text">{step.pali}</p>
                                            <p className="translation">{step.translation.en}</p>
                                            <div className="guidance">
                                                <span>💡</span> {step.guidance.en}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Practice Logger / Stats */}
                <div className="stats-container">
                    <div className="stats-header">
                        <IonIcon icon={timeOutline} />
                        <h3>Practice Logger</h3>
                    </div>

                    <div className="stats-summary">
                        <div className="stat-box">
                            <span className="value">{stats?.totalSessions || 0}</span>
                            <span className="label">Sessions</span>
                        </div>
                        <div className="stat-box">
                            <span className="value">{stats?.currentStreak || 0}</span>
                            <span className="label">Day Streak</span>
                        </div>
                    </div>

                    <IonButton expand="block" onClick={() => setIsModalOpen(true)} className="start-btn">
                        <IonIcon slot="start" icon={play} />
                        Start New Session
                    </IonButton>
                </div>

                <div style={{ height: '40px' }} />

                <EmptinessSessionModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); loadData(); }}
                />
            </IonContent>
        </IonPage>
    );
};

export default EmptinessPage;
