import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './BookList.css'; // 스타일 파일 import

function BookList({ books, onClickBook = null }) {
  const navigate = useNavigate();
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const ids = new Set(stored.map((book) => `${book.title}-${book.author}`));
    setBookmarkedIds(ids);
  }, [books]);

  const handleClick = (book) => {
    if (onClickBook) onClickBook(book);
  };

  const toggleBookmark = (book) => {
    const id = `${book.title}-${book.author}`;
    const existing = JSON.parse(localStorage.getItem('bookmarks')) || [];

    let updatedBookmarks;
    const isBookmarked = bookmarkedIds.has(id);

    if (isBookmarked) {
      updatedBookmarks = existing.filter((b) => `${b.title}-${b.author}` !== id);
      setBookmarkedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      alert('책갈피에서 삭제되었습니다.');
    } else {
      const newBook = { ...book, id };
      updatedBookmarks = [newBook, ...existing];
      setBookmarkedIds((prev) => new Set(prev).add(id));
      alert('책갈피에 추가되었습니다!');
    }

    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  if (books.length === 0) return <p>검색 결과가 없습니다.</p>;

  return (
    <ul className="book-list">
      {books.map((book, index) => {
        const id = `${book.title}-${book.author}`;
        const isBookmarked = bookmarkedIds.has(id);

        return (
          <li key={index} className="book-item">
            <img
              src={book.cover}
              alt={book.title}
              className={`book-cover ${onClickBook ? 'clickable' : ''}`}
              onClick={() => onClickBook && handleClick(book)}
            />
            <div className="book-info">
              <div className="book-title">{book.title}</div>
              <div className="book-author">{book.author}</div>
            </div>
            <button
              onClick={() => toggleBookmark(book)}
              className={`bookmark-button ${isBookmarked ? 'active' : ''}`}
              aria-label="책갈피 토글"
              title={isBookmarked ? '책갈피에서 제거' : '책갈피에 추가'}
            >
              {isBookmarked ? '⭐' : '☆'}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default BookList;
