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
    const stateRef = useRef(state);
    const retryRef = useRef<Record<string, number>>({});

    // Keep stateRef in sync
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        const audio = audioRef.current;

        const updateProgress = () => {
            if (!audio) return;

            const currentState = stateRef.current;
            const d = audio.duration;
            const metadataDuration = currentState.currentTrack?.duration || 0;
            const validAudioDuration = (isFinite(d) && d > 0) ? d : 0;

            let totalDuration = metadataDuration > 0 ? metadataDuration : validAudioDuration;

            if (totalDuration === 0 && currentState.currentTrack) {
                totalDuration = 600;
            }

            const realTime = audio.currentTime;

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
            const error = audio.error;
            console.warn('[AudioContext] Audio element error event:', error?.code, error?.message);

            const currentState = stateRef.current;
            const currentTrackId = currentState.currentTrack?.id;

            if (currentTrackId && error?.code === 4) {
                const retries = retryRef.current[currentTrackId] || 0;

                if (retries < 1) {
                    console.log(`[AudioContext] Source error for ${currentTrackId}. Attempting refresh (Attempt ${retries + 1}).`);
                    retryRef.current[currentTrackId] = retries + 1;

                    setTimeout(() => {
                        if (stateRef.current.currentTrack?.id === currentTrackId) {
                            playTrack(stateRef.current.currentTrack!);
                        }
                    }, 1000);
                } else {
                    console.error(`[AudioContext] Multiple failures for ${currentTrackId}. Giving up.`);
                }

                setState(s => ({ ...s, isPlaying: false }));
            }
        };

        const onPlay = () => setState(s => ({ ...s, isPlaying: true }));
        const onPause = () => setState(s => ({ ...s, isPlaying: false }));

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('error', handleError);
        };
    }, []); // Only run once

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

        // 1. Optimistically set state to show loading/playing UI immediately
        const newQueue = queue.length > 0 ? queue : [track];
        const newIndex = newQueue.findIndex(t => t.id === track.id);

        setState(s => ({
            ...s,
            currentTrack: track,
            isPlaying: true,
            queue: newQueue,
            currentIndex: newIndex !== -1 ? newIndex : 0,
            duration: track.duration || 0,
            currentTime: 0
        }));

        try {
            // 2. Prepare audio source
            const streamUrl = await AudioService.fetchStreamUrl(track.id);
            if (!streamUrl) throw new Error('Failed to get stream URL');

            // 3. Immediate playback start to preserve user gesture
            if (audioRef.current.src !== streamUrl) {
                audioRef.current.src = streamUrl;
            }
            audioRef.current.playbackRate = stateRef.current.playbackRate;

            const playPromise = audioRef.current.play();

            // 4. Background tasks (Async)
            // These don't block the initial play() call
            LocalAudioDataService.addToHistory(track);

            if (!track.duration || track.duration === 0) {
                AudioService.getVideoInfo(track.id).then(info => {
                    if (info && info.duration) {
                        setState(s => s.currentTrack?.id === track.id ? { ...s, duration: info.duration } : s);
                    }
                }).catch(e => console.warn('[AudioContext] Background duration fetch failed', e));
            }

            // 5. Handle seek/resume after play started
            LocalAudioDataService.getProgress(track.id).then(progress => {
                if (progress > 0 && audioRef.current) {
                    // Only seek if we're near the start (don't overwrite manual seeking)
                    if (audioRef.current.currentTime < 2) {
                        console.log(`[AudioContext] Resuming at ${progress}s`);
                        audioRef.current.currentTime = progress;
                    }
                }
            }).catch(e => console.warn('[AudioContext] Failed to get progress', e));

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    if (error.name === 'AbortError') {
                        console.log("[AudioContext] Playback interrupted (AbortError), ignoring.");
                        return;
                    }
                    console.error("[AudioContext] Playback failed/blocked:", error);
                    setState(s => ({ ...s, isPlaying: false }));
                });
            }

        } catch (error) {
            console.error('Playback error:', error);
            // NOTE: We DON'T clear currentTrack here anymore. 
            // We want the UI to stay on the track so the user can see what failed or try again.
            setState(s => ({ ...s, isPlaying: false }));
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

    const resume = () => {
        const playPromise = audioRef.current?.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                if (error.name === 'NotSupportedError') {
                    console.log('[AudioContext] resume failed with NotSupportedError, attempting refresh.');
                    const current = stateRef.current.currentTrack;
                    if (current) playTrack(current);
                } else {
                    console.warn('[AudioContext] resume failed:', error.message);
                }
            });
        }
    };

    const togglePlay = () => {
        const { isPlaying } = stateRef.current;
        if (isPlaying) pause();
        else resume();
    };

    const next = () => {
        const { queue, currentIndex, repeatMode } = stateRef.current;
        if (queue.length === 0) return;
        let nextIndex = currentIndex + 1;
        if (nextIndex >= queue.length) {
            if (repeatMode === 'all') nextIndex = 0;
            else return;
        }
        playTrack(queue[nextIndex]);
    };

    const previous = () => {
        const { queue, currentIndex, repeatMode } = stateRef.current;
        if (queue.length === 0) return;
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            if (repeatMode === 'all') prevIndex = queue.length - 1;
            else return;
        }
        playTrack(queue[prevIndex]);
    };

    const seek = (time: number) => {
        const { currentTrack } = stateRef.current;
        if (audioRef.current && currentTrack) {
            const seekTime = Math.floor(time);

            // Native seeking - just set currentTime
            // The browser will automatically send a Range request
            audioRef.current.currentTime = seekTime;

            // Optimistic update
            setState(s => ({ ...s, currentTime: seekTime }));
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
