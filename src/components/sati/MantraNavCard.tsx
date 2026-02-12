import React, { useState, useEffect } from 'react';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { chevronForward, flame } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { MantraService } from '../../services/MantraService';
import { Mantra } from '../../types/SatiTypes';

const MantraNavCard: React.FC = () => {
    const history = useHistory();
    const [summary, setSummary] = useState({ count: 0, recentMantra: '', streak: 0 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const mantras = await MantraService.getMantras();

        let totalStreak = 0;
        let mostRecent: Mantra | null = null;

        // Simple logic: sum streaks? Or max streak? Let's show max streak for now or total reps?
        // Let's show count of mantras and name of most recently practiced one.

        mantras.forEach(m => {
            if (m.stats.currentStreak > totalStreak) {
                totalStreak = m.stats.currentStreak;
            }

            if (m.stats.lastPracticeDate) {
                if (!mostRecent || new Date(m.stats.lastPracticeDate) > new Date(mostRecent.stats.lastPracticeDate!)) {
                    mostRecent = m;
                }
            }
        });

        setSummary({
            count: mantras.length,
            recentMantra: mostRecent ? (mostRecent as Mantra).basic.name : 'No practice yet',
            streak: totalStreak
        });
    };

    return (
        <div onClick={() => history.push('/sati/mantras')}>
            <IonCard style={{ margin: '0 0 24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <IonCardContent style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: '2rem' }}>📿</div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text-primary, #1f2937)' }}>Custom Mantras</h2>
                                <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--color-text-secondary, #6b7280)' }}>Personal Collection</p>
                            </div>
                        </div>
                        <IonIcon icon={chevronForward} style={{ color: 'var(--color-text-tertiary, #9ca3af)' }} />
                    </div>

                    <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary, #4b5563)', lineHeight: '1.5', marginBottom: '16px' }}>
                        {summary.count} mantras in your collection.
                    </p>

                    <div style={{
                        backgroundColor: 'var(--color-bg-secondary, #f9fafb)',
                        borderRadius: '12px',
                        padding: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary, #6b7280)', marginBottom: '2px' }}>Most Recent</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--color-text-primary, #111827)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                                {summary.recentMantra}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary, #6b7280)', marginBottom: '2px' }}>Best Streak</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--color-text-primary, #111827)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {summary.streak} days <IonIcon icon={flame} style={{ color: '#F59E0B', fontSize: '0.9rem' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '16px', textAlign: 'right', fontWeight: '600', color: 'var(--color-accent-primary, #2563eb)', fontSize: '0.9rem' }}>
                        Manage & Practice →
                    </div>
                </IonCardContent>
            </IonCard>
        </div>
    );
};

export default MantraNavCard;
