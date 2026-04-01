import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isInnerPage = location.pathname !== '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, [location]);

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      document.body.style.overflow = !prev ? 'hidden' : '';
      return !prev;
    });
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/#villas', label: 'Villas', hash: true },
    { to: '/services', label: 'Services' },
    { to: '/#gallery', label: 'Gallery', hash: true },
    { to: '/#about', label: 'About', hash: true },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (link) => {
    if (link.hash) return false;
    return location.pathname === link.to;
  };

  return (
    <header className={`header${isInnerPage ? ' header-inner-page' : ''}${scrolled ? ' scrolled' : ''}`}>
      <div className="top-bar">
        <div className="container top-bar-inner">
          <a href="tel:+917012605966" className="top-bar-phone">
            <i className="fas fa-phone"></i> +91 70126 05966
          </a>
          <a href="https://wa.me/917012605966" className="top-bar-whatsapp" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-whatsapp"></i> WhatsApp
          </a>
        </div>
      </div>
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">&#127807;</span>
          <span className="logo-text">RAINLEAF<br /><small>FAMILY RETREAT</small></span>
        </Link>
        <nav className={`nav${menuOpen ? ' active' : ''}`}>
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.hash ? (
                  <a href={link.to} className={isActive(link) ? 'active' : ''}>
                    {link.label}
                  </a>
                ) : (
                  <Link to={link.to} className={isActive(link) ? 'active' : ''}>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <Link to="/availability" className="btn btn-book-header">Book Now</Link>
        <button
          className={`menu-toggle${menuOpen ? ' active' : ''}`}
          aria-label="Toggle menu"
          onClick={toggleMenu}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}
