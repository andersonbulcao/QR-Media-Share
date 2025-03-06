import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Settings } from 'lucide-react';

interface QRCodeGeneratorProps {
  eventId: string;
  onGenerate: (qrCode: string) => void;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  eventId,
  onGenerate,
}) => {
  const [customization, setCustomization] = useState({
    color: '#000000',
    backgroundColor: '#FFFFFF',
    size: 256,
  });

  const qrValue = `https://yourdomain.com/event/${eventId}`;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Event QR Code</h2>
        <button
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={() => {/* Toggle customization panel */}}
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex justify-center mb-6">
        <QRCode
          value={qrValue}
          size={customization.size}
          fgColor={customization.color}
          bgColor={customization.backgroundColor}
          level="H"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            QR Code Color
          </label>
          <input
            type="color"
            value={customization.color}
            onChange={(e) =>
              setCustomization((prev) => ({ ...prev, color: e.target.value }))
            }
            className="mt-1 p-1 w-full rounded border border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Background Color
          </label>
          <input
            type="color"
            value={customization.backgroundColor}
            onChange={(e) =>
              setCustomization((prev) => ({
                ...prev,
                backgroundColor: e.target.value,
              }))
            }
            className="mt-1 p-1 w-full rounded border border-gray-300"
          />
        </div>

        <button
          onClick={() => onGenerate(qrValue)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate QR Code
        </button>
      </div>
    </div>
  );
};