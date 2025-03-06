export interface Event {
  id: string;
  name: string;
  description: string;
  qrCode: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface Media {
  id: string;
  eventId: string;
  type: 'photo' | 'video';
  url: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}