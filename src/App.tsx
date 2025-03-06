import React, { useState, useEffect } from 'react';
import { QRCodeGenerator } from './components/QRCodeGenerator';
import { MediaCapture } from './components/MediaCapture';
import { QRScanner } from './components/QRScanner';
import { Auth } from './components/Auth';
import { useEventStore } from './store/eventStore';
import { useAuthStore } from './store/authStore';
import { processImage, processVideo } from './utils/mediaProcessing';
import { Camera, QrCode, Image, LogOut, Scan, AlertCircle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { isSupabaseConfigured } from './lib/supabase';

function App() {
  const [activeTab, setActiveTab] = useState<'qr' | 'capture' | 'gallery' | 'scan'>('qr');
  const { currentEvent, mediaItems, addMediaItem } = useEventStore();
  const { user, signOut, loading } = useAuthStore();

  const handleMediaCapture = async (mediaBlob: Blob, type: 'photo' | 'video') => {
    if (!currentEvent || !user) return;

    const processedBlob = await (type === 'photo'
      ? processImage(mediaBlob)
      : processVideo(mediaBlob));

    const url = URL.createObjectURL(processedBlob);
    addMediaItem({
      id: Math.random().toString(36).substr(2, 9),
      eventId: currentEvent.id,
      type,
      url,
      createdAt: new Date(),
    });
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-center text-red-600 mb-4">
            <AlertCircle className="w-12 h-12" />
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900 mb-4">
            Configuration Required
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Please connect to Supabase using the "Connect to Supabase" button in the top right corner.
          </p>
          <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">
            <p className="font-medium mb-2">Required Environment Variables:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>VITE_SUPABASE_URL</li>
              <li>VITE_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">QR Media Share</h1>
          <button
            onClick={() => signOut()}
            className="flex items-center px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 px-4 py-3 text-center ${
                activeTab === 'qr'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <QrCode className="w-6 h-6 mx-auto mb-1" />
              <span>QR Code</span>
            </button>
            <button
              onClick={() => setActiveTab('scan')}
              className={`flex-1 px-4 py-3 text-center ${
                activeTab === 'scan'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <Scan className="w-6 h-6 mx-auto mb-1" />
              <span>Scan</span>
            </button>
            <button
              onClick={() => setActiveTab('capture')}
              className={`flex-1 px-4 py-3 text-center ${
                activeTab === 'capture'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <Camera className="w-6 h-6 mx-auto mb-1" />
              <span>Capture</span>
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 px-4 py-3 text-center ${
                activeTab === 'gallery'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <Image className="w-6 h-6 mx-auto mb-1" />
              <span>Gallery</span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'qr' && (
              <QRCodeGenerator
                eventId="demo-event"
                onGenerate={(qrCode) => console.log('QR Code generated:', qrCode)}
              />
            )}
            {activeTab === 'scan' && (
              <QRScanner
                onScan={(eventId) => console.log('Scanned event:', eventId)}
              />
            )}
            {activeTab === 'capture' && (
              <MediaCapture onCapture={handleMediaCapture} />
            )}
            {activeTab === 'gallery' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mediaItems.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-200"
                  >
                    {item.type === 'photo' ? (
                      <img
                        src={item.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;