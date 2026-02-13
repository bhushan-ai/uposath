import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonRange,
    IonTitle,
    IonText,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonSegment,
    IonSegmentButton,
    IonPopover,
    IonListHeader
} from '@ionic/react';
import {
    play,
    pause,
    playSkipForward,
    playSkipBack,
    refresh,
    star,
    starOutline,
    listOutline,
    informationCircleOutline,
    shareSocialOutline,
    timeOutline,
    speedometerOutline,
    musicalNote
} from 'ionicons/icons';
import { useAudio } from '../context/useAudio';
import { LocalAudioDataService } from '../services/audio/LocalAudioDataService';
import './AudioPlayerPage.css';

const AudioPlayerPage: React.FC = () => {
    const {
        currentTrack,
        isPlaying,
        togglePlay,
        next,
        previous,
        currentTime,
        duration,
        seek,
        playbackRate,
        setPlaybackRate,
        queue,
        sleepTimer,
        setSleepTimer
    } = useAudio();

    const [activeTab, setActiveTab] = useState<'player' | 'queue' | 'info'>('player');
    const [isFav, setIsFav] = useState(false);
    const [showSpeedPopover, setShowSpeedPopover] = useState<{ show: boolean, event: any }>({ show: false, event: undefined });
    const [showTimerPopover, setShowTimerPopover] = useState<{ show: boolean, event: any }>({ show: false, event: undefined });

    useEffect(() => {
        if (currentTrack) {
            LocalAudioDataService.isFavorite(currentTrack.id).then(setIsFav);
        }
    }, [currentTrack]);

    const handleToggleFavorite = async () => {
        if (currentTrack) {
            const nowFav = await LocalAudioDataService.toggleFavorite(currentTrack);
            setIsFav(nowFav);
        }
    };

    if (!currentTrack) {
        return (
            <IonPage>
                <IonHeader className="ion-no-border">
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/library" />
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding ion-text-center">
                    <div style={{ marginTop: '40%' }}>
                        <IonIcon icon={musicalNote} style={{ fontSize: '4rem', opacity: 0.2 }} />
                        <p>No track is currently playing.</p>
                        <IonButton routerLink="/library">Browse Library</IonButton>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/library" />
                    </IonButtons>
                    <IonTitle style={{ fontSize: '0.9rem', fontWeight: '600' }}>NOW PLAYING</IonTitle>
                    <IonButtons slot="end">
                        <IonButton>
                            <IonIcon icon={shareSocialOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <div style={{ padding: '0 8px' }}>
                    <IonSegment value={activeTab} onIonChange={e => setActiveTab(e.detail.value as any)} mode="ios" style={{ marginBottom: '24px' }}>
                        <IonSegmentButton value="player">
                            <IonLabel>Player</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="queue">
                            <IonLabel>Up Next</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="info">
                            <IonLabel>About</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    {activeTab === 'player' && (
                        <div className="player-view">
                            <div className="artwork-container">
                                <img src={currentTrack.thumbnail} alt={currentTrack.title} />
                            </div>

                            <div className="track-info">
                                <h1 className="track-title">{currentTrack.title}</h1>
                                <p className="track-artist">{currentTrack.channelTitle}</p>
                            </div>

                            <div className="scrubber">
                                <IonRange
                                    min={0}
                                    max={isNaN(duration) || !isFinite(duration) ? 100 : duration}
                                    value={currentTime}
                                    onIonChange={e => {
                                        // Only seek if we have a valid duration
                                        if (isFinite(duration)) seek(e.detail.value as number);
                                    }}
                                    color="primary"
                                    disabled={!isFinite(duration) || duration === 0}
                                />
                                <div className="time-display">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{(isNaN(duration) || !isFinite(duration)) ? '--:--' : formatTime(duration)}</span>
                                </div>
                            </div>

                            <div className="controls">
                                <IonButton fill="clear" onClick={() => previous()}>
                                    <IonIcon icon={playSkipBack} size="large" />
                                </IonButton>
                                <div className="play-button-container" onClick={togglePlay}>
                                    <IonIcon icon={isPlaying ? pause : play} style={{ color: 'white', fontSize: '2.4rem' }} />
                                </div>
                                <IonButton fill="clear" onClick={() => next()}>
                                    <IonIcon icon={playSkipForward} size="large" />
                                </IonButton>
                            </div>

                            <div className="extra-controls">
                                <IonButton
                                    fill="clear"
                                    color="medium"
                                    onClick={(e) => setShowSpeedPopover({ show: true, event: e.nativeEvent })}
                                >
                                    <div className="extra-btn-content">
                                        <IonIcon icon={speedometerOutline} style={{ fontSize: '1.4rem' }} />
                                        <span className="extra-label">{playbackRate}x</span>
                                    </div>
                                </IonButton>
                                <IonButton
                                    fill="clear"
                                    color={sleepTimer ? "primary" : "medium"}
                                    onClick={(e) => setShowTimerPopover({ show: true, event: e.nativeEvent })}
                                >
                                    <div className="extra-btn-content">
                                        <IonIcon icon={timeOutline} style={{ fontSize: '1.4rem' }} />
                                        <span className="extra-label">{sleepTimer ? `${sleepTimer}m` : 'Timer'}</span>
                                    </div>
                                </IonButton>
                                <IonButton
                                    fill="clear"
                                    color={isFav ? "primary" : "medium"}
                                    onClick={handleToggleFavorite}
                                >
                                    <div className="extra-btn-content">
                                        <IonIcon icon={isFav ? star : starOutline} style={{ fontSize: '1.4rem' }} />
                                        <span className="extra-label">{isFav ? 'Saved' : 'Save'}</span>
                                    </div>
                                </IonButton>
                            </div>
                        </div>
                    )}

                    {activeTab === 'queue' && (
                        <div className="queue-view">
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>Up Next</h3>
                            <IonList lines="none">
                                {queue.map((track: any, index: number) => (
                                    <IonItem key={`${track.id}-${index}`} button style={{ '--padding-start': '0', marginBottom: '8px' }}>
                                        <IonThumbnail slot="start" style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden' }}>
                                            <img src={track.thumbnail} alt={track.title} style={{ objectFit: 'cover' }} />
                                        </IonThumbnail>
                                        <IonLabel>
                                            <h2 style={{ fontSize: '0.9rem', fontWeight: track.id === currentTrack.id ? '700' : '500' }}>
                                                {track.title}
                                            </h2>
                                            <p style={{ fontSize: '0.75rem' }}>{track.channelTitle}</p>
                                        </IonLabel>
                                        {track.id === currentTrack.id && <IonIcon icon={musicalNote} slot="end" color="primary" />}
                                    </IonItem>
                                ))}
                            </IonList>
                        </div>
                    )}

                    {activeTab === 'info' && (
                        <div className="info-view">
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>About this recording</h3>
                            <IonText color="medium">
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                    {currentTrack.description || 'No description available for this recording.'}
                                </p>
                            </IonText>

                            <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '8px', fontSize: '0.7rem', color: '#333' }}>
                                <strong>Debug Info:</strong>
                                <div>State Duration: {duration}</div>
                                <div>Current Time: {currentTime}</div>
                                <div>Track Duration: {currentTrack.duration}</div>
                                <div>Is Finite: {isFinite(duration).toString()}</div>
                            </div>
                        </div>
                    )}
                </div>

                <IonPopover
                    isOpen={showSpeedPopover.show}
                    event={showSpeedPopover.event}
                    onDidDismiss={() => setShowSpeedPopover({ show: false, event: undefined })}
                >
                    <IonList>
                        <IonListHeader>Playback Speed</IonListHeader>
                        {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(rate => (
                            <IonItem
                                key={rate}
                                button
                                onClick={() => { setPlaybackRate(rate); setShowSpeedPopover({ show: false, event: undefined }); }}
                                detail={false}
                            >
                                <IonLabel color={playbackRate === rate ? "primary" : "none"}>{rate}x</IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </IonPopover>

                <IonPopover
                    isOpen={showTimerPopover.show}
                    event={showTimerPopover.event}
                    onDidDismiss={() => setShowTimerPopover({ show: false, event: undefined })}
                >
                    <IonList>
                        <IonListHeader>Sleep Timer</IonListHeader>
                        <IonItem button onClick={() => { setSleepTimer(null); setShowTimerPopover({ show: false, event: undefined }); }}>
                            <IonLabel color={sleepTimer === null ? "primary" : "none"}>Off</IonLabel>
                        </IonItem>
                        {[15, 30, 45, 60].map(mins => (
                            <IonItem
                                key={mins}
                                button
                                onClick={() => { setSleepTimer(mins); setShowTimerPopover({ show: false, event: undefined }); }}
                                detail={false}
                            >
                                <IonLabel color={sleepTimer === mins ? "primary" : "none"}>{mins} minutes</IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </IonPopover>
            </IonContent>
        </IonPage>
    );
};

export default AudioPlayerPage;
