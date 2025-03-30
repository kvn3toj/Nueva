import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AuthProvider } from './contexts/AuthContext';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Marketplace = React.lazy(() => import('./pages/Marketplace').then(module => ({ default: module.Marketplace })));
const VideoPlayer = React.lazy(() => import('./pages/VideoPlayer').then(module => ({ default: module.VideoPlayer })));
const Analytics = React.lazy(() => import('./pages/Analytics').then(module => ({ default: module.Analytics })));
const Profile = React.lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/video/:id" element={<VideoPlayer />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Suspense>
          </Layout>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;