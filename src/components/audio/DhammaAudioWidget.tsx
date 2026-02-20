import React, { useState, useEffect } from 'react';
import {
    IonCard,
    IonCardContent,
    IonIcon,
    IonText,
    IonSpinner
} from '@ionic/react';
import {
    musicalNotes,
    chevronForward
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { DhammaAudio, VideoInfo } from '../../plugins/dhamma-audio';
import { getDefaultChannel } from '../../services/channelManager';
import './DhammaAudioWidget.css';

const decodeTitle = (text: string): string => {
    if (!text) return '';
    try {
        return text
            .replace(/\\u0026/g, '&')
            .replace(/\\u003c/g, '<')
            .replace(/\\u003e/g, '>')
            .replace(/\\u0022/g, '"')
            .replace(/\\u0027/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    } catch {
        return text;
    }
};

const DhammaAudioWidget: React.FC = () => {
    const history = useHistory();
    const [featuredVideo, setFeaturedVideo] = useState<VideoInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeaturedContent();
    }, []);

    const loadFeaturedContent = async () => {
        try {
            const defChannel = await getDefaultChannel();
            if (defChannel) {
                const result = await DhammaAudio.getChannelPage({ channelId: defChannel.id });
                const firstVideo = result.sections?.[0]?.videos?.[0];
                if (firstVideo) {
                    setFeaturedVideo(firstVideo);
                }
            }
            setLoading(false);
        } catch (err) {
            console.error('Failed to load featured content:', err);
            setLoading(false);
        }
    };

    const handleNavigate = () => {
        if (featuredVideo?.channelId) {
            history.push(`/library/${featuredVideo.channelId}`);
        } else {
            history.push('/library');
        }
    };

    if (loading) {
        return (
            <div className="audio-widget-skeleton glass-card">
                <IonSpinner name="crescent" color="primary" />
                <IonText>Loading latest Dhamma...</IonText>
            </div>
        );
    }

    return (
        <IonCard className={`audio-widget glass-card ${featuredVideo ? 'has-featured' : 'empty'}`} onClick={handleNavigate}>
            {featuredVideo && (
                <div className="audio-widget__artwork" style={{ backgroundImage: `url(${featuredVideo.thumbnailUrl})` }}>
                    <div className="audio-widget__overlay"></div>
                </div>
            )}
            <IonCardContent>
                <div className="audio-widget__content">
                    <div className="audio-widget__info">
                        <IonText className="audio-widget__title">
                            {featuredVideo ? decodeTitle(featuredVideo.title) : 'DHAMMA AUDIO'}
                        </IonText>
                        <IonText color="medium" className="audio-widget__subtitle">
                            {featuredVideo ? featuredVideo.channelName : 'Listen to Buddhist Chants'}
                        </IonText>
                    </div>

                    <div className="audio-widget__action">
                        <IonIcon icon={chevronForward} className="audio-widget__arrow" />
                    </div>
                </div>
            </IonCardContent>
        </IonCard>
    );
};

export default DhammaAudioWidget;
