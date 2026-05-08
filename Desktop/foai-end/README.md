# FOAI Dashboard - ISS Tracking & News Assistant

A modern React dashboard with ISS tracking, news integration, and an AI-powered chatbot assistant.

## Features

- **ISS Tracking**: Real-time International Space Station position and telemetry
- **News Integration**: Latest news articles with filtering and categorization
- **AI Assistant**: Chatbot that answers questions about ISS and news data
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with React, TypeScript, TailwindCSS, and Framer Motion

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS, Lucide React icons
- **State Management**: Zustand
- **Maps**: Leaflet, React Leaflet
- **Charts**: Recharts
- **Animations**: Framer Motion
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd foai-end
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your HuggingFace API token to `.env`:
```
VITE_AI_TOKEN=your_huggingface_api_token_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open http://localhost:5173 in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

- `VITE_AI_TOKEN` - HuggingFace API token for the AI assistant

## Deployment

This application can be deployed to any static hosting service:

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add `VITE_AI_TOKEN` as an environment variable in Vercel
4. Deploy automatically

### Netlify

1. Build the application: `npm run build`
2. Upload the `dist` folder to Netlify
3. Add `VITE_AI_TOKEN` as an environment variable

### GitHub Pages

1. Build the application: `npm run build`
2. Deploy the `dist` folder to GitHub Pages
3. Update the `base` path in `vite.config.ts` if needed

## Project Structure

```
src/
├── chatbot/          # AI chatbot components
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── layouts/         # Layout components
├── map/             # Map-related components
├── pages/           # Page components
├── services/        # API services
├── store/           # State management
├── styles/          # Global styles
└── utils/           # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
