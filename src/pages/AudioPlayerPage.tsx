import React, { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
} from '@ionic/react';
import {
    play,
    pause,
    playSkipBack,
    playSkipForward,
    repeat,
    musicalNotes,
    libraryOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { DhammaAudio, PlaybackState } from '../plugins/dhamma-audio';
import './AudioPlayerPage.css';

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

/** Decode literal \uXXXX escapes and HTML entities from YouTube metadata */
const decodeText = (text: string): string => {
    if (!text) return '';
    return text
        .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
};

const AudioPlayerPage: React.FC = () => {
    const history = useHistory();
    const [playerState, setPlayerState] = useState<PlaybackState | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState(0);

    useEffect(() => {
        loadState();

        const stateListener = DhammaAudio.addListener('playbackStateChanged', (stateEvt: any) => {
            const isPlaying = stateEvt.state === 'PLAYING' || stateEvt.isPlaying === true;
            const isPaused = stateEvt.state === 'PAUSED' || stateEvt.isPaused === true;
            setPlayerState(prev => {
                const merged = {
                    ...(prev || {}),
                    ...stateEvt,
                    currentVideo: stateEvt.currentVideo ?? prev?.currentVideo,
                    isPlaying,
                    isPaused,
                    position: stateEvt.position ?? prev?.position ?? 0,
                    duration: stateEvt.duration ?? prev?.duration ?? 0,
                    speed: stateEvt.speed ?? prev?.speed ?? 1,
                };
                if (merged.currentVideo) {
                    Preferences.set({ key: 'last_playing_video', value: JSON.stringify(merged.currentVideo) }).catch(console.error);
                }
                return merged;
            });
        });

        const progressListener = DhammaAudio.addListener('progressUpdate', (data) => {
            if (!isDragging) {
                setPlayerState(prev => prev ? { ...prev, position: data.position, duration: data.duration } : null);
            }
        });

        return () => {
            stateListener.then(l => l.remove());
            progressListener.then(l => l.remove());
        };
    }, [isDragging]);

    const loadState = async () => {
        try {
            const state = await DhammaAudio.getPlaybackState();
            let savedVideo = null;
            try {
                const { value } = await Preferences.get({ key: 'last_playing_video' });
                if (value) savedVideo = JSON.parse(value);
            } catch (e) {
                console.error('Failed to load saved video', e);
            }

            setPlayerState(prev => ({
                ...(prev || {}),
                ...state,
                currentVideo: state.currentVideo ?? prev?.currentVideo ?? savedVideo,
                isPlaying: state.state === 'PLAYING' || (state as any).isPlaying === true,
                isPaused: state.state === 'PAUSED' || (state as any).isPaused === true,
                position: state.position ?? prev?.position ?? 0,
                duration: state.duration ?? prev?.duration ?? 0,
                speed: (state as any).speed ?? prev?.speed ?? 1,
            }));
        } catch (err) {
            console.error('Failed to load player state:', err);
        }
    };

    const handleSeek = async (value: number) => {
        const intValue = Math.floor(value);
        setPlayerState(prev => prev ? { ...prev, position: intValue } : null);
        await DhammaAudio.seekTo({ position: intValue });
        setTimeout(() => setIsDragging(false), 500);
    };

    const togglePlay = async () => {
        if (!playerState) return;
        if (playerState.isPlaying) {
            await DhammaAudio.pause();
        } else {
            await DhammaAudio.resume();
        }
    };

    const toggleRepeat = async () => {
        if (!playerState) return;
        const modes: ('OFF' | 'ALL' | 'ONE')[] = ['OFF', 'ALL', 'ONE'];
        const currentIdx = modes.indexOf(playerState.repeatMode || 'OFF');
        const nextMode = modes[(currentIdx + 1) % modes.length];
        await DhammaAudio.setRepeatMode({ mode: nextMode });
        setPlayerState(prev => prev ? { ...prev, repeatMode: nextMode } : null);
    };

    const handleSetSpeed = async (speed: number) => {
        await DhammaAudio.setPlaybackSpeed({ speed });
        setPlayerState(prev => prev ? { ...prev, speed } : null);
    };

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Empty state — no video loaded or playing yet
    if (!playerState?.currentVideo) {
        return (
            <IonPage>
                <IonHeader className="ion-no-border">
                    <IonToolbar>
                        <IonButtons slot="start"><IonBackButton defaultHref="/library" /></IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <div className="player-empty">
                        <IonIcon icon={musicalNotes} className="player-empty-icon" />
                        <span className="player-empty-text">Nothing playing yet</span>
                        <span className="player-empty-sub">Select a track from the Dhamma Audio library to begin</span>
                        <IonButton
                            className="player-empty-btn"
                            fill="outline"
                            onClick={() => history.push('/library')}
                        >
                            <IonIcon icon={libraryOutline} slot="start" />
                            Browse Dhamma Audio
                        </IonButton>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    const { currentVideo, isPlaying, position, duration } = playerState;
    const currentSpeed = playerState.speed ?? 1;

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar style={{ '--background': 'transparent' }}>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/library" />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen scrollY={false}>
                <div className="player-container">
                    {/* Artwork */}
                    <div className="player-artwork-wrapper">
                        {currentVideo.thumbnailUrl ? (
                            <img
                                src={currentVideo.thumbnailUrl}
                                alt={currentVideo.title}
                                className="player-artwork"
                            />
                        ) : (
                            <div className="player-artwork-placeholder">
                                <IonIcon icon={musicalNotes} />
                            </div>
                        )}
                    </div>

                    {/* Track Info */}
                    <div className="player-info">
                        <h1 className="player-title">{decodeText(currentVideo.title)}</h1>
                        {currentVideo.channelName && (
                            <p className="player-artist">{decodeText(currentVideo.channelName)}</p>
                        )}
                    </div>

                    {/* Progress */}
                    <div className="player-progress-section">
                        <input
                            type="range"
                            className="player-progress-bar"
                            value={isDragging ? dragPosition : position}
                            min={0}
                            max={duration || 1}
                            step={500}
                            onMouseDown={() => setIsDragging(true)}
                            onTouchStart={() => setIsDragging(true)}
                            onChange={(e) => setDragPosition(Number(e.target.value))}
                            onMouseUp={(e) => handleSeek(Number((e.target as HTMLInputElement).value))}
                            onTouchEnd={(e) => handleSeek(Number((e.target as HTMLInputElement).value))}
                            style={{ width: '100%', accentColor: 'var(--color-accent-primary, #ffc670)' }}
                        />
                        <div className="player-time-row">
                            <span className="player-time">{formatTime(isDragging ? dragPosition : position)}</span>
                            <span className="player-time">{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Speed Chips */}
                    <div className="speed-row">
                        {SPEED_OPTIONS.map(s => (
                            <button
                                key={s}
                                className={`speed-chip ${currentSpeed === s ? 'speed-chip--active' : ''}`}
                                onClick={() => handleSetSpeed(s)}
                            >
                                {s === 1 ? '1×' : `${s}×`}
                            </button>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="player-controls">
                        <IonButton fill="clear" className="player-control-btn player-control-btn--secondary" style={{ visibility: 'hidden' }}>
                            <IonIcon icon={repeat} />
                        </IonButton>
                        <IonButton fill="clear" className="player-control-btn player-control-btn--secondary">
                            <IonIcon icon={playSkipBack} />
                        </IonButton>
                        <IonButton
                            fill="clear"
                            className="player-play-btn"
                            onClick={togglePlay}
                        >
                            <IonIcon icon={isPlaying ? pause : play} />
                        </IonButton>
                        <IonButton fill="clear" className="player-control-btn player-control-btn--secondary">
                            <IonIcon icon={playSkipForward} />
                        </IonButton>
                        <IonButton
                            fill="clear"
                            className={`player-control-btn player-control-btn--secondary ${playerState.repeatMode !== 'OFF' ? 'is-active' : ''}`}
                            onClick={toggleRepeat}
                        >
                            <IonIcon icon={repeat} />
                            {playerState.repeatMode === 'ONE' && <span className="repeat-badge">1</span>}
                        </IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AudioPlayerPage;
