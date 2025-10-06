import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useDebounced from '../hooks/useDebounced';
import { searchMovies } from '../api/tmdb';
import type { Movie } from '../types';
import './SearchList.css';

export default function SearchList(): React.JSX.Element {
  const [query, setQuery] = useState('');
  const debounced = useDebounced(query, 300);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'title' | 'release_date' | 'vote_average'>('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    let mounted = true;
    async function doSearch() {
      setLoading(true);
      setError(null);
      try {
        const res = await searchMovies(debounced);
        if (!mounted) return;
        setMovies(res);
        const ids = res.map((m) => m.id);
        try {
          sessionStorage.setItem('lastResults', JSON.stringify(ids));
        } catch (e) {}
      } catch (e) {
        setError((e && (e as any).message) || 'Failed to fetch');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (debounced.trim()) {
      doSearch();
    } else {
      setMovies([]);
      try {
        sessionStorage.removeItem('lastResults');
      } catch (e) {}
    }
    return () => {
      mounted = false;
    };
  }, [debounced]);

  const sorted = [...movies].sort((a, b) => {
    if (sortBy === 'vote_average') {
      const va = a.vote_average ?? 0;
      const vb = b.vote_average ?? 0;
      return order === 'asc' ? va - vb : vb - va;
    }
    const va = String((a as any)[sortBy] ?? '').toLowerCase();
    const vb = String((b as any)[sortBy] ?? '').toLowerCase();
    return order === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  // Keep navigation order in sync with current visible list
  useEffect(() => {
    try {
      if (sorted.length) {
        sessionStorage.setItem('lastResults', JSON.stringify(sorted.map((m) => m.id)));
      } else {
        sessionStorage.removeItem('lastResults');
      }
    } catch (e) {}
  }, [sorted]);

  return (
    <div className="page-wrap">
      <div className="search-header">
        <div className="search-controls">
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            aria-label="Search movies"
          />
          <div className="selects">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="select">
              <option value="title">Title</option>
              <option value="release_date">Release Date</option>
              <option value="vote_average">Rating</option>
            </select>
            <select value={order} onChange={(e) => setOrder(e.target.value as any)} className="select">
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <div className="center-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && sorted.length === 0 && <div className="center-message">No results</div>}

      <ul className="result-grid">
        {sorted.map((m) => (
          <li key={m.id} className="card">
            <Link to={`/detail/${m.id}`} className="card-link">
              {m.poster_path ? (
                <img className="poster" src={`https://image.tmdb.org/t/p/w300${m.poster_path}`} alt={m.title} />
              ) : (
                <div className="poster placeholder">No Image</div>
              )}
              <div className="card-body">
                <div className="card-title-row">
                  <div className="card-title">{m.title}</div>
                  <span className="rating-badge" aria-label="Rating">
                    {typeof m.vote_average === 'number' ? m.vote_average.toFixed(1) : '—'}
                  </span>
                </div>
                <div className="card-sub">{m.release_date ?? '—'}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
