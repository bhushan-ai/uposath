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

            // Priority 1: Track metadata duration
            // Priority 2: Audio element duration (if finite)
            // Priority 3: Fallback (600s) if we have a track but no length info
            const metadataDuration = state.currentTrack?.duration || 0;
            const validAudioDuration = (isFinite(d) && d > 0) ? d : 0;

            // Total track duration logic
            let totalDuration = metadataDuration > 0 ? metadataDuration : validAudioDuration;

            // If still 0 but we are playing, use a fallback so scrubber isn't disabled/stuck
            if (totalDuration === 0 && state.currentTrack) {
                totalDuration = 600; // 10 minutes fallback
            }

            // Current Time = HTML Audio Time + Seek Offset
            const realTime = audio.currentTime + seekOffsetRef.current;

            setState(s => ({
                ...s,
                currentTime: realTime,
                duration: totalDuration
            }));
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
    }, [state.currentTrack]);

    // Periodically save progress
    useEffect(() => {
        if (state.currentTrack && state.isPlaying && audioRef.current) {
            const interval = setInterval(() => {
                LocalAudioDataService.saveProgress(state.currentTrack!.id, audioRef.current!.currentTime + seekOffsetRef.current);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [state.currentTrack, state.isPlaying]);

    const playTrack = async (track: AudioTrack, queue: AudioTrack[] = []) => {
        if (!audioRef.current) return;
        try {
            // Check for missing duration
            let trackToPlay = track;
            if (!trackToPlay.duration || trackToPlay.duration === 0) {
                console.log('[AudioContext] Duration missing, attempting fetch...');
                try {
                    const info = await AudioService.getVideoInfo(track.id);
                    if (info && info.duration) {
                        trackToPlay = { ...track, duration: info.duration };
                    }
                } catch (e) {
                    console.warn('[AudioContext] Failed to fetch missing duration metadata');
                }
            }

            // Save to history
            LocalAudioDataService.addToHistory(trackToPlay);

            // Get resume position
            const progress = await LocalAudioDataService.getProgress(trackToPlay.id);

            const streamUrl = AudioService.getStreamUrl(trackToPlay.id);
            if (!streamUrl) throw new Error('Failed to get stream URL');

            // Reset seek offset for new track unless resuming
            seekOffsetRef.current = 0;

            if (progress > 0) {
                const seekUrl = AudioService.getStreamUrl(trackToPlay.id, progress);
                audioRef.current.src = seekUrl;
                seekOffsetRef.current = progress;
                audioRef.current.currentTime = 0;
            } else {
                audioRef.current.src = streamUrl;
                audioRef.current.currentTime = 0;
            }

            audioRef.current.playbackRate = state.playbackRate;
            audioRef.current.play();

            const newQueue = queue.length > 0 ? queue : [trackToPlay];
            const newIndex = newQueue.findIndex(t => t.id === trackToPlay.id);

            setState(s => ({
                ...s,
                currentTrack: trackToPlay,
                isPlaying: true,
                queue: newQueue,
                currentIndex: newIndex !== -1 ? newIndex : 0,
                duration: trackToPlay.duration || 0
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
                LocalAudioDataService.saveProgress(state.currentTrack.id, audioRef.current.currentTime + seekOffsetRef.current);
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
            const seekTime = Math.floor(time);
            const streamUrl = AudioService.getStreamUrl(state.currentTrack.id, seekTime);

            audioRef.current.src = streamUrl;
            audioRef.current.currentTime = 0;
            seekOffsetRef.current = seekTime;

            // Optimistic update
            setState(s => ({ ...s, currentTime: seekTime }));

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
