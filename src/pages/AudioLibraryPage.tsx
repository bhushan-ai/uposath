import { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonButton,
    IonIcon,
    IonSpinner,
    IonText,
    IonBadge,
    IonSkeletonText,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent
} from '@ionic/react';
import {
    searchOutline,
    musicalNotesOutline,
    playCircleOutline,
    chevronForwardOutline,
    starOutline,
    timeOutline,
    rose
} from 'ionicons/icons';
import { AudioService } from '../services/audio/AudioService';
import { LocalAudioDataService } from '../services/audio/LocalAudioDataService';
import { AudioTrack, AudioChannel } from '../types/audio/AudioTypes';
import { useAudio } from '../context/useAudio';

const AudioLibraryPage: React.FC = () => {
    const { playTrack } = useAudio();
    const [channels, setChannels] = useState<AudioChannel[]>([]);
    const [featuredTracks, setFeaturedTracks] = useState<AudioTrack[]>([]);
    const [recentTracks, setRecentTracks] = useState<AudioTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<AudioTrack[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Using the stable CID for Pañcasikha
    const PRIMARY_CHANNEL_ID = 'UC0ypu1lL-Srd4O7XHjtIQrg';

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load subscribed channels
            const subIds = await LocalAudioDataService.getSubscribedChannels();
            const channelInfos = await Promise.all(
                subIds.map(id => {
                    // Normalize the ID if it's the old handle without ñ
                    const targetId = id === '@Pancasikha-358' ? PRIMARY_CHANNEL_ID : id;
                    return AudioService.getChannelInfo(targetId).catch(() => null);
                })
            );
            setChannels(channelInfos.filter(c => c !== null) as AudioChannel[]);

            // Load primary channel videos
            const pVideos = await AudioService.getChannelVideos(PRIMARY_CHANNEL_ID, 15);
            setFeaturedTracks(pVideos.slice(0, 5));
            setRecentTracks(pVideos.slice(5));
        } catch (error) {
            console.error('Error loading library data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBrowseChannel = async (channelId: string) => {
        setLoading(true);
        try {
            const videos = await AudioService.getChannelVideos(channelId, 20);
            setRecentTracks(videos);
        } catch (error) {
            console.error('Error browsing channel:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (val: string) => {
        setSearchQuery(val);
        if (!val.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const results = await AudioService.search(val);
            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonTitle style={{ fontWeight: '800', fontSize: '1.4rem' }}>Dhamma Library</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        placeholder="Search suttas, talks, teachers..."
                        onIonInput={e => handleSearch(e.detail.value!)}
                        debounce={500}
                    />
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                {searchQuery ? (
                    <div className="search-results">
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <IonIcon icon={searchOutline} style={{ marginRight: '8px', opacity: 0.5 }} />
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Results</h3>
                            {isSearching && <IonSpinner name="dots" style={{ marginLeft: '12px' }} />}
                        </div>
                        <IonList lines="none">
                            {searchResults.map(track => (
                                <IonItem
                                    key={track.id}
                                    button
                                    onClick={() => playTrack(track, searchResults)}
                                    style={{ '--padding-start': '0', marginBottom: '8px' }}
                                >
                                    <IonThumbnail slot="start" style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden' }}>
                                        {track.thumbnail ? (
                                            <img src={track.thumbnail} alt={track.title} style={{ objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', background: 'var(--ion-color-step-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <IonIcon icon={musicalNotesOutline} color="medium" />
                                            </div>
                                        )}
                                    </IonThumbnail>
                                    <IonLabel>
                                        <h2 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '4px' }}>{track.title}</h2>
                                        <p style={{ fontSize: '0.8rem' }}>{track.channelTitle}</p>
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </div>
                ) : (
                    <>
                        <div className="section" style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px' }}>Featured Today</h3>
                            <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '8px' }}>
                                {loading ? [1, 2, 3].map(i => (
                                    <IonSkeletonText key={i} animated style={{ width: '220px', height: '140px', borderRadius: '16px' }} />
                                )) : featuredTracks.map(track => (
                                    <div
                                        key={track.id}
                                        onClick={() => playTrack(track, featuredTracks)}
                                        style={{ minWidth: '220px', cursor: 'pointer' }}
                                    >
                                        <div style={{
                                            width: '100%',
                                            aspectRatio: '16/9',
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            marginBottom: '8px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}>
                                            {track.thumbnail ? (
                                                <img src={track.thumbnail} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: 'var(--ion-color-step-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IonIcon icon={musicalNotesOutline} size="large" color="medium" />
                                                </div>
                                            )}
                                            <div style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                                                <IonBadge color="dark" style={{ opacity: 0.8 }}>{Math.floor(track.duration / 60)}m</IonBadge>
                                            </div>
                                        </div>
                                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {track.title}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="section" style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>Dhamma Channels</h3>
                                <IonButton fill="clear" size="small">Explore All</IonButton>
                            </div>
                            <IonList lines="none" style={{ background: 'transparent' }}>
                                {loading ? [1].map(i => (
                                    <IonItem key={i}><IonSkeletonText animated style={{ width: '100%', height: '60px' }} /></IonItem>
                                )) : channels.map(channel => (
                                    <IonItem
                                        key={channel.id}
                                        button
                                        onClick={() => handleBrowseChannel(channel.id)}
                                        style={{ '--padding-start': '0', marginBottom: '4px' }}
                                    >
                                        <IonThumbnail slot="start" style={{ width: '48px', height: '48px', margin: '4px' }}>
                                            {channel.logo ? (
                                                <img src={channel.logo} alt={channel.name} style={{ borderRadius: '50%' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: 'var(--ion-color-step-200)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IonIcon icon={rose} color="medium" />
                                                </div>
                                            )}
                                        </IonThumbnail>
                                        <IonLabel>
                                            <h2 style={{ fontWeight: '600', fontSize: '1rem' }}>{channel.name}</h2>
                                            <p style={{ fontSize: '0.8rem' }}>Dhamma Recordings</p>
                                        </IonLabel>
                                        <IonIcon icon={chevronForwardOutline} slot="end" size="small" color="medium" />
                                    </IonItem>
                                ))}
                            </IonList>
                        </div>

                        <div className="section">
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px' }}>Recent Recordings</h3>
                            <IonList lines="none">
                                {loading ? [1, 2, 3, 4].map(i => (
                                    <IonItem key={i}><IonSkeletonText animated style={{ width: '100%', height: '50px' }} /></IonItem>
                                )) : recentTracks.map(track => (
                                    <IonItem
                                        key={track.id}
                                        button
                                        onClick={() => playTrack(track, recentTracks)}
                                        style={{ '--padding-start': '0', marginBottom: '8px' }}
                                    >
                                        <IonThumbnail slot="start" style={{ width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden' }}>
                                            {track.thumbnail ? (
                                                <img src={track.thumbnail} alt={track.title} style={{ objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: 'var(--ion-color-step-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IonIcon icon={musicalNotesOutline} color="medium" />
                                                </div>
                                            )}
                                        </IonThumbnail>
                                        <IonLabel>
                                            <h2 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '2px' }}>{track.title}</h2>
                                            <p style={{ fontSize: '0.75rem' }}>{track.channelTitle}</p>
                                        </IonLabel>
                                        <IonIcon icon={playCircleOutline} slot="end" color="primary" />
                                    </IonItem>
                                ))}
                            </IonList>
                        </div>
                    </>
                )}
            </IonContent>
        </IonPage>
    );
};

export default AudioLibraryPage;
