import React, { useEffect, useState } from 'react';
import { getPopularMovies, getGenres } from '../api/tmdb';
import type { Movie } from '../types';
import { Link } from 'react-router-dom';
import './GalleryView.css';

export default function GalleryView(): React.JSX.Element {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const [m, g] = await Promise.all([getPopularMovies(), getGenres()]);
        if (!mounted) return;
        setMovies(m);
        setGenres(g);
        try {
          sessionStorage.setItem('lastResults', JSON.stringify(m.map((x) => x.id)));
        } catch (e) {}
      } catch (e) {
        setError((e && (e as any).message) || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const toggle = (id: number) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const filtered = selected.length ? movies.filter((mv) => (mv.genre_ids || []).some((id) => selected.includes(id))) : movies;

  // Keep navigation order in sync with current filtered list
  useEffect(() => {
    try {
      if (filtered.length) {
        sessionStorage.setItem('lastResults', JSON.stringify(filtered.map((m) => m.id)));
      } else {
        sessionStorage.removeItem('lastResults');
      }
    } catch (e) {}
  }, [filtered]);

  return (
    <div className="page-wrap">
      <h2 className="page-title">Popular Movies</h2>
      {loading && <div className="center-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="genre-bar">
        {genres.map((g) => (
          <button key={g.id} onClick={() => toggle(g.id)} className={`genre-btn ${selected.includes(g.id) ? 'active' : ''}`}>
            {g.name}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {filtered.map((m) => (
          <Link to={`/detail/${m.id}`} key={m.id} className="gallery-card">
            {m.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w300${m.poster_path}`} alt={m.title} className="gallery-img" />
            ) : (
              <div className="gallery-img placeholder">No Image</div>
            )}
            <div className="gallery-title">{m.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
