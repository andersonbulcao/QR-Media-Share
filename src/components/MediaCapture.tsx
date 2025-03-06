import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, Video, RotateCcw } from 'lucide-react';

interface MediaCaptureProps {
  onCapture: (mediaBlob: Blob, type: 'photo' | 'video') => void;
}

export const MediaCapture: React.FC<MediaCaptureProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => onCapture(blob, 'photo'));
    }
  }, [onCapture]);

  const startRecording = useCallback(() => {
    if (!webcamRef.current?.video) return;

    const stream = webcamRef.current.video.srcObject as MediaStream;
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      onCapture(blob, 'video');
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  }, [onCapture]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Webcam
        ref={webcamRef}
        audio={mode === 'video'}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode,
          aspectRatio: 16 / 9,
        }}
        className="w-full rounded-lg shadow-lg"
      />

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <button
          onClick={() => setMode('photo')}
          className={`p-3 rounded-full ${
            mode === 'photo' ? 'bg-blue-600' : 'bg-gray-600'
          } text-white`}
        >
          <Camera className="w-6 h-6" />
        </button>

        <button
          onClick={mode === 'photo' ? capturePhoto : isRecording ? stopRecording : startRecording}
          className={`p-4 rounded-full ${
            isRecording ? 'bg-red-600' : 'bg-blue-600'
          } text-white`}
        >
          {mode === 'photo' ? (
            <Camera className="w-8 h-8" />
          ) : isRecording ? (
            <div className="w-8 h-8 rounded-sm bg-red-600" />
          ) : (
            <Video className="w-8 h-8" />
          )}
        </button>

        <button
          onClick={() =>
            setFacingMode((prev) =>
              prev === 'user' ? 'environment' : 'user'
            )
          }
          className="p-3 rounded-full bg-gray-600 text-white"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};