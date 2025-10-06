import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar(): React.JSX.Element {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand">TMDB Explorer</div>
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>Home</NavLink>
          <NavLink to="/gallery" className={({ isActive }) => (isActive ? 'active' : '')}>Gallery</NavLink>
          <NavLink to="/favorites" className={({ isActive }) => (isActive ? 'active' : '')}>Favorites</NavLink>
        </nav>
      </div>
    </header>
  );
}
