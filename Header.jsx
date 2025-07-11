import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';

function Header({ title }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleMenuClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.headerWrapper}>
      <div ref={menuRef} className={styles.menuContainer}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={styles.menuButton}
        >
          ☰
        </button>

        {menuOpen && (
          <div className={styles.dropdown}>
            <MenuItem onClick={() => handleMenuClick('/')}>메인메뉴</MenuItem>
            <MenuItem onClick={() => handleMenuClick('/search')}>책 검색</MenuItem>
            <MenuItem onClick={() => handleMenuClick('/bookmark')}>책갈피</MenuItem>
            <MenuItem onClick={() => handleMenuClick('/review')}>독후감 목록</MenuItem>
          </div>
        )}
      </div>

      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}

function MenuItem({ children, onClick }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={styles.menuItem}
      style={{
        color: hover ? 'red' : 'black',
        backgroundColor: hover ? '#f9f9f9' : 'white',
      }}
    >
      {children}
    </div>
  );
}

export default Header;
