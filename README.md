# QR Media Share

A modern web application that allows users to create events, generate QR codes, and share media content (photos and videos) with event participants.

![QR Media Share](https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&q=80&w=1000)

## Features

- 🔐 **Secure Authentication**
  - Email and password authentication
  - Protected routes and data access
  - Row Level Security (RLS) for database operations

- 📱 **Event Management**
  - Create and manage events
  - Generate unique QR codes for each event
  - Set event expiration dates
  - View event details and participants

- 📸 **Media Sharing**
  - Capture photos and videos directly in the app
  - Automatic media compression for optimal performance
  - Support for both front and back cameras
  - Real-time media gallery updates

- 🔍 **QR Code Scanning**
  - Built-in QR code scanner
  - Quick event access through QR codes
  - Seamless participant onboarding

- 🎨 **Modern UI/UX**
  - Responsive design for all devices
  - Clean and intuitive interface
  - Real-time feedback and notifications
  - Loading states and error handling

## Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Zustand (State Management)
  - Lucide React (Icons)

- **Backend**
  - Supabase (Backend as a Service)
  - PostgreSQL Database
  - Row Level Security
  - Real-time Subscriptions

- **Media Processing**
  - Browser Image Compression
  - HTML5 Media Capture
  - QR Code Generation and Scanning

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/qr-media-share.git
   cd qr-media-share
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

The application uses Supabase as its backend. The database schema includes:

- `events` table for managing events
- `media` table for storing media items
- Row Level Security policies for data protection

To set up the database:

1. Create a new Supabase project
2. Connect to Supabase using the "Connect to Supabase" button
3. The migrations will automatically create the necessary tables and security policies

## Usage

1. **Authentication**
   - Sign up with email and password
   - Sign in to access your events and media

2. **Creating Events**
   - Click "Create Event" and enter event details
   - A unique QR code is generated for the event

3. **Sharing Media**
   - Scan the event QR code
   - Use the camera to capture photos or videos
   - View shared media in the gallery

4. **Managing Events**
   - View all your events
   - Set expiration dates
   - Delete events when no longer needed

## Security

The application implements several security measures:

- Authentication using Supabase Auth
- Row Level Security (RLS) policies
- Secure media upload and storage
- Protected API endpoints
- Type-safe database operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.io/) for the backend infrastructure
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons