
import React, { useState, useEffect } from 'react';
import { IonCard, IonCardContent, IonIcon, IonSkeletonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { moon, calendarNumber, timeOutline } from 'ionicons/icons';
import { getNextUposatha, UposathaDay } from '../../services/uposathaCalculator';
import { getSavedLocation } from '../../services/locationManager';
import { Observer } from '@ishubhamx/panchangam-js';
import { UposathaObservanceService } from '../../services/UposathaObservanceService';
import { UposathaStats } from '../../types/ObservanceTypes';
import './NextUposathaWidget.css';

const NextUposathaWidget: React.FC = () => {
    const history = useHistory();
    const [nextUposatha, setNextUposatha] = useState<UposathaDay | null>(null);
    const [daysUntil, setDaysUntil] = useState<number | null>(null);
    const [stats, setStats] = useState<UposathaStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const loc = await getSavedLocation();
        const observer = loc ? new Observer(loc.latitude, loc.longitude, loc.altitude) : new Observer(24.7914, 85.0002, 111);

        const today = new Date();
        const next = getNextUposatha(today, observer);
        setNextUposatha(next);

        if (next) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const target = new Date(next.date);
            target.setHours(0, 0, 0, 0);
            const diffTime = target.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysUntil(diffDays);
        }

        const s = await UposathaObservanceService.getStats();
        setStats(s);
        setLoading(false);
    };

    const handleCardClick = () => {
        if (nextUposatha) {
            history.push(`/day/${nextUposatha.date.toISOString().split('T')[0]}`);
        } else {
            history.push('/calendar');
        }
    };

    if (loading) {
        return (
            <IonCard style={{ margin: '16px', borderRadius: '16px' }}>
                <IonCardContent>
                    <IonSkeletonText animated style={{ width: '60%' }} />
                    <IonSkeletonText animated style={{ width: '40%' }} />
                </IonCardContent>
            </IonCard>
        );
    }

    if (!nextUposatha) return null;

    const getPhaseIcon = () => {
        if (nextUposatha.status.isFullMoon) return '🌕';
        if (nextUposatha.status.isNewMoon) return '🌑';
        return '🌗';
    };

    const getPhaseLabel = () => {
        if (nextUposatha.status.isFullMoon) return 'Full Moon Uposatha';
        if (nextUposatha.status.isNewMoon) return 'New Moon Uposatha';
        if (nextUposatha.status.isAshtami) return 'Ashtami Uposatha';
        if (nextUposatha.status.isChaturdashi) return 'Chaturdashi Uposatha';
        return 'Uposatha Day';
    };

    return (
        <IonCard
            button
            onClick={handleCardClick}
            className="next-uposatha-card"
        >
            <IonCardContent className="next-uposatha-content">
                <div>
                    <div className="next-uposatha-eyebrow">
                        Upcoming Uposatha
                    </div>
                    <div className="next-uposatha-title">
                        <span>{getPhaseIcon()}</span>
                        <span>{getPhaseLabel()}</span>
                    </div>
                    <div className="next-uposatha-date">
                        {nextUposatha.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                    </div>
                </div>

                <div>
                    <div className="next-uposatha-badge">
                        {daysUntil === 0 ? 'Today' : `In ${daysUntil} Days`}
                    </div>
                    {stats && stats.rate > 0 && (
                        <div className="next-uposatha-rate">
                            Rate: {stats.rate.toFixed(0)}%
                        </div>
                    )}
                </div>
            </IonCardContent>
        </IonCard>
    );
};

export default NextUposathaWidget;
