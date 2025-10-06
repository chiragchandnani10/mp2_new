import axios from 'axios';
import type { Movie } from '../types';

const API_KEY = '08e1a2b3bcf75bf05dd772b40dd9465b';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  timeout: 8000
});

tmdbApi.interceptors.request.use((cfg) => {
  cfg.params = { ...(cfg.params || {}), api_key: API_KEY };
  return cfg;
});

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  const res = await tmdbApi.get('/search/movie', { params: { query, include_adult: false, page: 1 } });
  return res.data?.results || [];
}

export async function getPopularMovies(): Promise<Movie[]> {
  const res = await tmdbApi.get('/movie/popular', { params: { page: 1 } });
  return res.data?.results || [];
}

export async function getMovieDetails(id: string): Promise<any> {
  const res = await tmdbApi.get(`/movie/${id}`);
  return res.data;
}

export async function getGenres(): Promise<{ id: number; name: string }[]> {
  const res = await tmdbApi.get('/genre/movie/list');
  return res.data?.genres || [];
}
