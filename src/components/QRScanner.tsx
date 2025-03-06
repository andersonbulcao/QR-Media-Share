import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff } from 'lucide-react';

interface QRScannerProps {
  onScan: (eventId: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode('qr-reader');

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop();
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      await scannerRef.current?.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          const eventId = new URL(decodedText).pathname.split('/').pop();
          if (eventId) {
            onScan(eventId);
            stopScanning();
          }
        },
        () => {}
      );
      setScanning(true);
    } catch (err) {
      console.error(err);
    }
  };

  const stopScanning = async () => {
    try {
      await scannerRef.current?.stop();
      setScanning(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div
        id="qr-reader"
        className="w-full max-w-md mx-auto overflow-hidden rounded-lg"
      />
      <button
        onClick={scanning ? stopScanning : startScanning}
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {scanning ? (
          <>
            <CameraOff className="w-5 h-5 mr-2" />
            Stop Scanning
          </>
        ) : (
          <>
            <Camera className="w-5 h-5 mr-2" />
            Start Scanning
          </>
        )}
      </button>
    </div>
  );
};