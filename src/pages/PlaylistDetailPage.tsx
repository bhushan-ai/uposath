import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonSpinner,
} from '@ionic/react';
import { musicalNotes } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { DhammaAudio, VideoInfo } from '../plugins/dhamma-audio';
import './AudioLibraryPage.css';

const formatDuration = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

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

const PlaylistDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [videos, setVideos] = useState<VideoInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

    useEffect(() => {
        const listener = DhammaAudio.addListener('playbackStateChanged', (state) => {
            setCurrentVideoId(state.currentVideo?.id || null);
        });
        DhammaAudio.getPlaybackState().then(state => {
            setCurrentVideoId(state.currentVideo?.id || null);
        }).catch(() => { });
        return () => { listener.then(l => l.remove()); };
    }, []);

    useEffect(() => {
        const loadPlaylist = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const result = await DhammaAudio.getPlaylistVideos({ playlistId: id });
                setVideos(result.videos || []);
            } catch (err) {
                console.error('Failed to load playlist:', err);
            }
            setLoading(false);
        };
        loadPlaylist();
    }, [id]);

    const playVideo = (video: VideoInfo) => {
        DhammaAudio.playVideo({ video });
        history.push('/player');
    };

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/library" text="Library" />
                    </IonButtons>
                    <IonTitle>Playlist</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {loading ? (
                    <div className="library-empty">
                        <IonSpinner name="crescent" />
                    </div>
                ) : videos.length > 0 ? (
                    <div className="library-list">
                        {videos.map(video => {
                            const isPlaying = currentVideoId === video.id;
                            return (
                                <div
                                    key={video.id}
                                    className={`library-card ${isPlaying ? 'library-card--playing' : ''}`}
                                    onClick={() => playVideo(video)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
                                        {isPlaying && <div className="library-now-playing-dot" />}
                                        <div className="library-thumb-wrapper">
                                            {video.thumbnailUrl ? (
                                                <img src={video.thumbnailUrl} alt="" className="library-thumb" />
                                            ) : (
                                                <div className="library-thumb-placeholder">
                                                    <IonIcon icon={musicalNotes} />
                                                </div>
                                            )}
                                            {video.duration > 0 && (
                                                <span className="library-duration-badge">
                                                    {formatDuration(video.duration)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="library-card-content">
                                            <h3 className="library-card-title">{decodeTitle(video.title)}</h3>
                                            <p className="library-card-meta">
                                                {video.channelName}
                                                {video.duration > 0 && ` · ${Math.floor(video.duration / 60)} min`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="library-empty-state" style={{ marginTop: '40px' }}>
                        <IonIcon icon={musicalNotes} className="library-empty-icon" style={{ opacity: 0.3 }} />
                        <h3>Empty Playlist</h3>
                        <p>This playlist has no videos.</p>
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default PlaylistDetailPage;
