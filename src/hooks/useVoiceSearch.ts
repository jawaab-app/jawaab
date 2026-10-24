import { useCallback, useEffect, useRef, useState } from 'react';

// Speech-to-text for the search field. The native module only exists in a
// development or store build; in Expo Go it is absent and `available` is false.

type Module = typeof import('expo-speech-recognition');

let mod: Module | null | undefined;
function load(): Module | null {
  if (mod !== undefined) return mod;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mod = require('expo-speech-recognition') as Module;
  } catch {
    mod = null;
  }
  return mod;
}

export interface VoiceSearch {
  available: boolean;
  listening: boolean;
  /** Latest transcript, interim while listening, final when it ends. */
  transcript: string;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
}

export function useVoiceSearch(onFinal?: (text: string) => void): VoiceSearch {
  const m = load();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;

  useEffect(() => {
    if (!m) return;
    const M = m.ExpoSpeechRecognitionModule;
    const subs = [
      M.addListener('start', () => {
        setListening(true);
        setError(null);
        setTranscript('');
      }),
      M.addListener('end', () => setListening(false)),
      M.addListener('result', (e) => {
        const text = e.results[0]?.transcript ?? '';
        setTranscript(text);
        if (e.isFinal && text.trim()) onFinalRef.current?.(text.trim());
      }),
      M.addListener('error', (e) => {
        setListening(false);
        setError(e.error === 'not-allowed' ? 'Microphone access is off.' : e.error === 'no-speech' ? null : e.message || 'Could not hear that.');
      }),
    ];
    return () => subs.forEach((s) => s.remove());
  }, [m]);

  const start = useCallback(async () => {
    if (!m) return;
    const M = m.ExpoSpeechRecognitionModule;
    const perm = await M.requestPermissionsAsync();
    if (!perm.granted) {
      setError('Microphone access is off.');
      return;
    }
    M.start({ lang: 'en-US', interimResults: true, continuous: false });
  }, [m]);

  const stop = useCallback(() => {
    m?.ExpoSpeechRecognitionModule.stop();
  }, [m]);

  return { available: !!m, listening, transcript, error, start, stop };
}
