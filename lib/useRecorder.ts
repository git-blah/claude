"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const VIDEO_TYPES = [
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
  "video/mp4",
];
const AUDIO_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];

function pickMimeType(video: boolean): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return (video ? VIDEO_TYPES : AUDIO_TYPES).find((t) => MediaRecorder.isTypeSupported(t));
}

function describeError(err: unknown): string {
  if (err instanceof DOMException) {
    if (err.name === "NotAllowedError") {
      return "Camera/microphone permission was denied. Allow access in your browser's site settings and try again.";
    }
    if (err.name === "NotFoundError") {
      return "No camera or microphone was found on this device.";
    }
    if (err.name === "NotReadableError") {
      return "Your camera or microphone is being used by another app.";
    }
  }
  return "Couldn't start the camera or microphone.";
}

/** Camera/mic stream plus a MediaRecorder for one take at a time. */
export function useRecorder() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const closeStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  /** Open (or reuse) a stream. Returns false if access failed. */
  const openStream = useCallback(
    async (video: boolean): Promise<boolean> => {
      const current = streamRef.current;
      if (current && current.getVideoTracks().length > 0 === video) return true;
      closeStream();
      setError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        setError("This browser can't record. Try a recent Chrome, Edge, Firefox or Safari over HTTPS.");
        return false;
      }
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: video ? { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        });
        streamRef.current = s;
        setStream(s);
        return true;
      } catch (err) {
        setError(describeError(err));
        return false;
      }
    },
    [closeStream],
  );

  const startRecording = useCallback((): boolean => {
    const s = streamRef.current;
    if (!s) return false;
    const mimeType = pickMimeType(s.getVideoTracks().length > 0);
    try {
      const recorder = new MediaRecorder(s, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start(250);
      recorderRef.current = recorder;
      return true;
    } catch {
      setError("Recording isn't supported in this browser.");
      return false;
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (!recorder || recorder.state === "inactive") return Promise.resolve(null);
    return new Promise((resolve) => {
      recorder.onstop = () => {
        const type = recorder.mimeType || chunksRef.current[0]?.type || "video/webm";
        resolve(new Blob(chunksRef.current, { type }));
      };
      recorder.stop();
    });
  }, []);

  useEffect(() => closeStream, [closeStream]);

  return { stream, error, openStream, closeStream, startRecording, stopRecording };
}
