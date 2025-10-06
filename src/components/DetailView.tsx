import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../api/tmdb';
import './DetailView.css';

export default function DetailView(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const d = await getMovieDetails(id);
        if (!mounted) return;
        setMovie(d);
      } catch (e) {
        setError((e && (e as any).message) || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  function readLastResults(): number[] {
    try {
      const raw = sessionStorage.getItem('lastResults');
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr.map((x) => Number(x)).filter((n) => Number.isFinite(n));
      return [];
    } catch (e) {
      return [];
    }
  }

  function goRelative(delta: number) {
    const ids = readLastResults();
    if (!ids.length || !id) {
      navigate(`/detail/${String(Number(id || 0) + delta)}`);
      return;
    }
    const idx = ids.findIndex((x) => x === Number(id));
    if (idx === -1) {
      navigate(`/detail/${String(Number(id) + delta)}`);
      return;
    }
    const newIdx = idx + delta;
    if (newIdx < 0 || newIdx >= ids.length) return;
    navigate(`/detail/${ids[newIdx]}`);
  }

  if (loading) return <div className="center-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!movie) return <div className="center-message">No data</div>;

  return (
    <div className="page-wrap detail-wrap">
      <div className="detail-grid">
        <div className="poster-col">
          {movie.poster_path ? (
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="detail-poster" />
          ) : (
            <div className="poster placeholder-large">No Image</div>
          )}
        </div>
        <div className="info-col">
          <h1 className="detail-title">{movie.title}</h1>
          <div className="sub-line">{movie.release_date ?? '—'} • {movie.runtime ? `${movie.runtime} min` : '—'}</div>
          <div className="genres">
            {(movie.genres || []).map((g: any) => (
              <span key={g.id} className="genre-chip">{g.name}</span>
            ))}
          </div>
          <p className="overview">{movie.overview}</p>
          <div className="nav-buttons">
            <button className="nav-btn" onClick={() => goRelative(-1)}>◀ Prev</button>
            <button className="nav-btn" onClick={() => goRelative(1)}>Next ▶</button>
          </div>
        </div>
      </div>
    </div>
  );
}
