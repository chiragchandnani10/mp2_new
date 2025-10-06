import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchList from './components/SearchList';
import GalleryView from './components/GalleryView';
import DetailView from './components/DetailView';
import Favorites from './components/Favorites';
import ErrorBoundary from './components/ErrorBoundary';

export default function App(): React.JSX.Element {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<SearchList />} />
            <Route path="/gallery" element={<GalleryView />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/detail/:id" element={<DetailView />} />
            <Route path="*" element={<div className="center-message">Page not found</div>} />
          </Routes>
        </ErrorBoundary>
      </main>
      <footer className="app-footer">
        <div className="footer-inner">
          <span className="footer-brand">CineScape</span>
          <span className="footer-sep">•</span>
          <span className="footer-tag">Discover. Save. Rewatch.</span>
        </div>
      </footer>
    </div>
  );
}
