import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import ReviewList from './components/ReviewList';
import BookmarkPage from './components/BookmarkPage';
import ReviewContentEditor from './components/ReviewContentEditor';
import bookImage from './assets/book.jpg';
import './App.css';
import usePageTitle from './hooks/usePageTitle';
import { fetchBooksByKeyword } from './assets/api';

function getRandomBooks(books, count = 5) {
  const shuffled = [...books].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function AppHome() {
  usePageTitle("메인 화면");
  const [bestSellers, setBestSellers] = useState([]);
  const location = useLocation();

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const books = await fetchBooksByKeyword('베스트셀러');
        const randomBooks = getRandomBooks(books, 5);
        setBestSellers(randomBooks);
      } catch (error) {
        console.error('베스트셀러 불러오기 실패:', error);
      }
    }

    if (location.pathname === '/') {
      fetchBestSellers();
    }
  }, [location]);

  return (
    <div className="app-home">
      <h1 className="app-title">나만의 서재</h1>

      <p className="app-subtitle">
        책 검색부터 책갈피, 독후감, 베스트셀러까지<br />
        당신만의 도서 기록을 시작해보세요.
      </p>

      <img className="book-image" src={bookImage} alt="펼쳐진 책" />

      <div className="menu-buttons">
        <Link to="/search"><button className="menu-button">🔍 책 검색</button></Link>
        <Link to="/bookmark"><button className="menu-button">📌 책갈피</button></Link>
        <Link to="/review"><button className="menu-button">📖 독후감 보기</button></Link>
      </div>

      <div className="bestseller-section">
        <h2 className="bestseller-title">베스트셀러</h2>
        {bestSellers.length === 0 ? (
          <p>베스트셀러를 불러오는 중입니다...</p>
        ) : (
          <ul className="bestseller-list">
            {bestSellers.map((book, idx) => {
              const shortTitle = book.title.split('-')[0].trim();
              return (
                <li className="bestseller-item" key={`${book.title}-${idx}`}>
                  <img className="book-cover" src={book.cover} alt={book.title} />
                  <div className="book-title" title={book.title}>
                    {shortTitle}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AppHome />} />
          <Route path="/search" element={<SearchForm />} />
          <Route path="/bookmark" element={<BookmarkPage />} />
          <Route path="/review" element={<ReviewList />} />
          <Route path="/review/write" element={<ReviewContentEditor />} />
          <Route path="/review/write/content" element={<ReviewContentEditor />} />
          <Route path="/review/content" element={<ReviewContentEditor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;