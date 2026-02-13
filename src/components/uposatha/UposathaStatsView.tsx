
import React, { useState, useEffect } from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, IonProgressBar, IonList, IonItem, IonLabel, IonNote, IonIcon } from '@ionic/react';
import { checkmarkCircle, closeCircle, moon, ellipseOutline } from 'ionicons/icons';
import { UposathaStats, UposathaObservance } from '../../types/ObservanceTypes';
import { UposathaObservanceService } from '../../services/UposathaObservanceService';

const UposathaStatsView: React.FC = () => {
    const [stats, setStats] = useState<UposathaStats | null>(null);
    const [history, setHistory] = useState<UposathaObservance[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const s = await UposathaObservanceService.getStats();
        const h = await UposathaObservanceService.getHistory();
        setStats(s);
        setHistory(h);
    };

    if (!stats) return <div className="ion-padding text-center">Loading stats...</div>;

    const getPhaseIcon = (phase: string) => {
        switch (phase) {
            case 'full': return '🌕';
            case 'new': return '🌑';
            default: return '🌗';
        }
    };

    return (
        <div style={{ paddingBottom: '40px' }}>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <IonCard style={{ margin: 0, background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', color: 'white' }}>
                    <IonCardContent className="text-center">
                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.rate.toFixed(0)}%</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Observance Rate</div>
                    </IonCardContent>
                </IonCard>
                <IonCard style={{ margin: 0, background: 'linear-gradient(135deg, #f59e0b 0%, #ca8a04 100%)', color: 'white' }}>
                    <IonCardContent className="text-center">
                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.currentStreak}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Current Streak</div>
                    </IonCardContent>
                </IonCard>
            </div>

            <IonCard style={{ margin: '0 0 16px 0' }}>
                <IonCardHeader>
                    <IonCardTitle style={{ fontSize: '1rem' }}>Moon Phase Breakdown</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                            <span>Full Moon 🌕</span>
                            <span>{stats.byMoonPhase.full.observed} / {stats.byMoonPhase.full.total}</span>
                        </div>
                        <IonProgressBar value={stats.byMoonPhase.full.total > 0 ? stats.byMoonPhase.full.observed / stats.byMoonPhase.full.total : 0} color="success" />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                            <span>New Moon 🌑</span>
                            <span>{stats.byMoonPhase.new.observed} / {stats.byMoonPhase.new.total}</span>
                        </div>
                        <IonProgressBar value={stats.byMoonPhase.new.total > 0 ? stats.byMoonPhase.new.observed / stats.byMoonPhase.new.total : 0} color="primary" />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                            <span>Quarters 🌗</span>
                            <span>{stats.byMoonPhase.quarter.observed} / {stats.byMoonPhase.quarter.total}</span>
                        </div>
                        <IonProgressBar value={stats.byMoonPhase.quarter.total > 0 ? stats.byMoonPhase.quarter.observed / stats.byMoonPhase.quarter.total : 0} color="warning" />
                    </div>
                </IonCardContent>
            </IonCard>

            <h3 style={{ marginLeft: '4px', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--ion-color-step-800)' }}>Recent History</h3>
            <IonList inset>
                {history.slice(0, 10).map(obs => (
                    <IonItem key={obs.id}>
                        <div slot="start" style={{ fontSize: '1.5rem' }}>
                            {getPhaseIcon(obs.moonPhase)}
                        </div>
                        <IonLabel>
                            <h2>{new Date(obs.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</h2>
                            <p>{obs.status === 'observed' ? (obs.level || 'Full') : (obs.skipReason || 'Skipped')}</p>
                        </IonLabel>
                        <IonNote slot="end">
                            {obs.status === 'observed' ? (
                                <IonIcon icon={checkmarkCircle} color="success" style={{ fontSize: '1.5rem' }} />
                            ) : (
                                <IonIcon icon={closeCircle} color="danger" style={{ fontSize: '1.5rem' }} />
                            )}
                        </IonNote>
                    </IonItem>
                ))}
                {history.length === 0 && (
                    <IonItem lines="none">
                        <IonLabel className="text-center text-gray-500 italic">No history yet.</IonLabel>
                    </IonItem>
                )}
            </IonList>
        </div>
    );
};

export default UposathaStatsView;
