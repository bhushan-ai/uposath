import React, { createContext, useState, useEffect, useRef } from 'react';
import { AudioTrack, AudioPlaybackState } from '../types/audio/AudioTypes';
import { AudioService } from '../services/audio/AudioService';
import { LocalAudioDataService } from '../services/audio/LocalAudioDataService';

export interface AudioContextType extends AudioPlaybackState {
    playTrack: (track: AudioTrack, queue?: AudioTrack[]) => void;
    pause: () => void;
    resume: () => void;
    togglePlay: () => void;
    next: () => void;
    previous: () => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    setPlaybackRate: (rate: number) => void;
    toggleMute: () => void;
    setRepeatMode: (mode: 'off' | 'one' | 'all') => void;
    toggleShuffle: () => void;
    sleepTimer: number | null; // minutes remaining
    setSleepTimer: (minutes: number | null) => void;
}

export const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AudioPlaybackState>({
        isPlaying: false,
        currentTrack: null,
        currentTime: 0,
        duration: 0,
        volume: 1,
        playbackRate: 1,
        isMuted: false,
        repeatMode: 'off',
        isShuffle: false,
        queue: [],
        currentIndex: -1
    });

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const seekOffsetRef = useRef<number>(0);

    useEffect(() => {
        audioRef.current = new Audio();
        const audio = audioRef.current;

        const updateProgress = () => {
            const d = audio.duration;
            const validDuration = (isFinite(d) && d > 0) ? d : (state.currentTrack?.duration || 0);

            // Force total duration from track info if available
            // This prevents scrubber from confusing partial stream length with total song length
            const displayDuration = state.currentTrack?.duration || validDuration;

            // Current Time = HTML Audio Time + Seek Offset
            // If we sought to 60s, and played 5s, HTML audio is 5s, but real time is 65s.
            const realTime = audio.currentTime + seekOffsetRef.current;

            setState(s => ({ ...s, currentTime: realTime, duration: displayDuration }));
        };

        const handleEnded = () => {
            next();
        };

        const handleError = () => {
            console.error('Audio element error:', audio.error);
            setState(s => ({
                ...s,
                isPlaying: false,
                currentTrack: null
            }));
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', () => setState(s => ({ ...s, isPlaying: true })));
        audio.addEventListener('pause', () => setState(s => ({ ...s, isPlaying: false })));
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
            audio.pause();
        };
    }, []);

    // Periodically save progress
    useEffect(() => {
        if (state.currentTrack && state.isPlaying && audioRef.current) {
            const interval = setInterval(() => {
                LocalAudioDataService.saveProgress(state.currentTrack!.id, audioRef.current!.currentTime);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [state.currentTrack, state.isPlaying]);

    const playTrack = async (track: AudioTrack, queue: AudioTrack[] = []) => {
        if (!audioRef.current) return;
        try {
            // Check if track has duration; if not, fetch it
            let trackToPlay = track;
            if (!trackToPlay.duration || trackToPlay.duration === 0) {
                console.log('[AudioContext] Fetching missing duration for:', track.id);
                try {
                    const info = await AudioService.getVideoInfo(track.id);
                    if (info && info.duration) {
                        trackToPlay = { ...track, duration: info.duration };
                        console.log('[AudioContext] Updated duration:', trackToPlay.duration);
                    }
                } catch (e) {
                    console.error('[AudioContext] Failed to fetch duration:', e);
                }
            }

            // Save to history
            LocalAudioDataService.addToHistory(trackToPlay);

            // Get resume position
            const progress = await LocalAudioDataService.getProgress(trackToPlay.id);

            const streamUrl = AudioService.getStreamUrl(trackToPlay.id);
            if (!streamUrl) throw new Error('Failed to get stream URL');

            // Lightweight check that the stream endpoint is reachable and returns audio
            let headResponse: Response;
            try {
                headResponse = await fetch(streamUrl, { method: 'HEAD' });
            } catch (networkError) {
                throw new Error(
                    `Stream endpoint unreachable: ${networkError instanceof Error ? networkError.message : String(networkError)
                    }`
                );
            }

            if (!headResponse.ok) {
                throw new Error(`Stream unavailable (status ${headResponse.status})`);
            }

            const contentType = headResponse.headers.get('Content-Type') || '';
            if (!contentType.startsWith('audio/')) {
                throw new Error(`Stream is not audio (Content-Type: ${contentType})`);
            }

            // Reset seek offset for new track
            seekOffsetRef.current = 0;

            audioRef.current.src = streamUrl;
            audioRef.current.playbackRate = state.playbackRate;
            audioRef.current.currentTime = progress || 0;
            // If resuming, we might want to use seeking logic too?
            // For now, let's assume standard play works for start, or if progress > 0 we might need to use seek logic?
            // Actually, if progress > 0, we should probably treat it as a seek to `progress`.

            if (progress > 0) {
                const seekUrl = AudioService.getStreamUrl(trackToPlay.id, progress);
                audioRef.current.src = seekUrl;
                seekOffsetRef.current = progress;
                audioRef.current.currentTime = 0;
            }

            audioRef.current.play();

            const newQueue = queue.length > 0 ? queue : [trackToPlay];
            const newIndex = newQueue.findIndex(t => t.id === trackToPlay.id);

            setState(s => ({
                ...s,
                currentTrack: trackToPlay,
                isPlaying: true,
                queue: newQueue,
                currentIndex: newIndex !== -1 ? newIndex : 0,
                duration: trackToPlay.duration // Set initial duration
            }));
        } catch (error) {
            console.error('Playback error:', error);
            setState(s => ({
                ...s,
                isPlaying: false,
                currentTrack: null
            }));
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            if (state.currentTrack) {
                LocalAudioDataService.saveProgress(state.currentTrack.id, audioRef.current.currentTime);
            }
        }
    };

    const resume = () => audioRef.current?.play();

    const togglePlay = () => {
        if (state.isPlaying) pause();
        else resume();
    };

    const next = () => {
        if (state.queue.length === 0) return;
        let nextIndex = state.currentIndex + 1;
        if (nextIndex >= state.queue.length) {
            if (state.repeatMode === 'all') nextIndex = 0;
            else return;
        }
        playTrack(state.queue[nextIndex]);
    };

    const previous = () => {
        if (state.queue.length === 0) return;
        let prevIndex = state.currentIndex - 1;
        if (prevIndex < 0) {
            if (state.repeatMode === 'all') prevIndex = state.queue.length - 1;
            else return;
        }
        playTrack(state.queue[prevIndex]);
    };

    const seek = (time: number) => {
        if (audioRef.current && state.currentTrack) {
            // Optimistic update
            setState(s => ({ ...s, currentTime: time }));

            // Reload audio source from new start time
            // Round to integer for cleaner ffmpeg seeking
            const seekTime = Math.floor(time);
            const streamUrl = AudioService.getStreamUrl(state.currentTrack.id, seekTime);

            // Re-assign src and play
            audioRef.current.src = streamUrl;
            audioRef.current.currentTime = 0;
            seekOffsetRef.current = seekTime;

            audioRef.current.play();
        }
    };

    const setVolume = (volume: number) => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            setState(s => ({ ...s, volume }));
        }
    };

    const setPlaybackRate = (rate: number) => {
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
            setState(s => ({ ...s, playbackRate: rate }));
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            const newMuted = !state.isMuted;
            audioRef.current.muted = newMuted;
            setState(s => ({ ...s, isMuted: newMuted }));
        }
    };

    const [sleepTimer, setSleepTimerState] = useState<number | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const setSleepTimer = (minutes: number | null) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setSleepTimerState(minutes);

        if (minutes !== null) {
            timerRef.current = setInterval(() => {
                setSleepTimerState(prev => {
                    if (prev === null || prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        pause();
                        return null;
                    }
                    return prev - 1;
                });
            }, 60000);
        }
    };

    const setRepeatMode = (mode: 'off' | 'one' | 'all') => setState(s => ({ ...s, repeatMode: mode }));
    const toggleShuffle = () => setState(s => ({ ...s, isShuffle: !s.isShuffle }));

    return (
        <AudioContext.Provider value={{
            ...state,
            playTrack,
            pause,
            resume,
            togglePlay,
            next,
            previous,
            seek,
            setVolume,
            setPlaybackRate,
            toggleMute,
            setRepeatMode,
            toggleShuffle,
            sleepTimer,
            setSleepTimer
        }}>
            {children}
        </AudioContext.Provider>
    );
};
