import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import usePageTitle from '../hooks/usePageTitle';
import styles from './BookmarkPage.module.css';

function BookmarkPage() {
  usePageTitle("책갈피 목록");

  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('bookmarks');
    if (stored) setBookmarks(JSON.parse(stored));
  }, []);

  const handleDelete = (targetId) => {
    const updated = bookmarks.filter((book) => book.id !== targetId);
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const handleReviewWrite = (book) => {
    navigate('/review/write', {
      state: {
        ...book,
        date: new Date().toLocaleDateString(),
      },
    });
  };

  return (
    <div className={styles.container}>
      <Header title="책갈피 목록" />
      {bookmarks.length === 0 ? (
        <p className={styles.emptyMessage}>아직 책갈피한 책이 없습니다.</p>
      ) : (
        <ul className={styles.bookList}>
          {bookmarks.map((book) => (
            <li key={book.id} className={styles.bookItem}>
              <img
                src={book.cover}
                alt={book.title}
                className={styles.coverImage}
              />
              <div className={styles.bookInfo}>
                <div className={styles.title}>{book.title}</div>
                <div className={styles.author}>{book.author}</div>
              </div>
              <div className={styles.buttonGroup}>
                <button onClick={() => handleReviewWrite(book)}>독후감 쓰기</button>
                <button onClick={() => handleDelete(book.id)}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookmarkPage;
