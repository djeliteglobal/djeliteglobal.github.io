import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VoiceMessageProps {
  onSend: (audioBlob: Blob, duration: number) => void;
  disabled?: boolean;
}

export const VoiceMessage: React.FC<VoiceMessageProps> = ({ onSend, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) { // Max 60 seconds
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  const sendVoiceMessage = () => {
    if (audioBlob && recordingTime > 0) {
      onSend(audioBlob, recordingTime);
      setAudioBlob(null);
      setRecordingTime(0);
    }
  };

  const cancelRecording = () => {
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (audioBlob) {
    return (
      <div className="flex items-center gap-2 bg-[color:var(--surface-alt)] rounded-full p-2">
        <audio controls className="flex-1 h-8">
          <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
        </audio>
        <span className="text-xs text-[color:var(--text-secondary)]">
          {formatTime(recordingTime)}
        </span>
        <button
          onClick={sendVoiceMessage}
          className="w-8 h-8 bg-[color:var(--accent)] text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
        >
          ➤
        </button>
        <button
          onClick={cancelRecording}
          className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isRecording ? (
        <motion.div
          className="flex items-center gap-2 bg-red-500/20 rounded-full px-4 py-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <motion.div
            className="w-3 h-3 bg-red-500 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <span className="text-sm font-mono text-red-500">
            {formatTime(recordingTime)}
          </span>
          <button
            onClick={stopRecording}
            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform ml-2"
          >
            ⏹
          </button>
        </motion.div>
      ) : (
        <button
          onClick={startRecording}
          disabled={disabled}
          className="w-10 h-10 bg-[color:var(--accent)] text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🎤
        </button>
      )}
    </div>
  );
};

interface VoiceMessagePlayerProps {
  audioUrl: string;
  duration: number;
  isOwn?: boolean;
}

export const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({
  audioUrl,
  duration,
  isOwn = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl max-w-xs ${
      isOwn 
        ? 'bg-[color:var(--accent)] text-black' 
        : 'bg-[color:var(--surface)] text-[color:var(--text-primary)]'
    }`}>
      <button
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isOwn ? 'bg-black/20' : 'bg-[color:var(--accent)]'
        }`}
      >
        {isPlaying ? '⏸' : '▶️'}
      </button>
      
      <div className="flex-1">
        <div className={`h-1 rounded-full ${isOwn ? 'bg-black/20' : 'bg-[color:var(--border)]'}`}>
          <div 
            className={`h-full rounded-full transition-all ${
              isOwn ? 'bg-black/40' : 'bg-[color:var(--accent)]'
            }`}
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1 opacity-70">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};