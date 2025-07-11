import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBooksByKeyword } from '../assets/api';
import BookList from './BookList';
import Header from './Header';
import usePageTitle from '../hooks/usePageTitle';
import styles from './SearchForm.module.css';

function SearchForm() {
  usePageTitle("책 검색");

  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchBooks = async () => {
    if (!keyword.trim()) return alert('검색어를 입력해주세요!');
    setLoading(true);
    try {
      const booksData = await fetchBooksByKeyword(keyword, '', 1);
      setBooks(booksData);
      setPage(1);
      setHasMore(booksData.length === 50);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreBooks = async () => {
    const nextPage = page + 1;
    setLoading(true);
    try {
      const moreBooks = await fetchBooksByKeyword(keyword, '', nextPage);
      setBooks((prevBooks) => [...prevBooks, ...moreBooks]);
      setPage(nextPage);
      setHasMore(moreBooks.length === 50);
    } catch (error) {
      console.error('Error loading more books:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = (book) => {
    const existing = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const isAlready = existing.some((b) => b.title === book.title && b.author === book.author);
    if (isAlready) return alert('이미 책갈피에 추가된 책입니다!');
    const newBook = { ...book, id: `${book.title}-${book.author}` };
    const newBookmarks = [newBook, ...existing];
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    alert('책갈피에 추가되었습니다!');
  };

  return (
    <>
      <Header title="책 검색" />
      <div className={styles.container}>
        <div className={styles.searchBox}>
          <input
            type="text"
            value={keyword}
            placeholder="검색어 입력"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                fetchBooks();
              }
            }}
            className={styles.input}
          />
          <button onClick={fetchBooks} className={styles.searchButton}>
            검색
          </button>
        </div>

        {loading && <p>도서 정보를 불러오는 중입니다...</p>}

        <BookList books={books} onBookmark={addBookmark} />

        {hasMore && (
          <div className={styles.loadMoreWrapper}>
            <button onClick={fetchMoreBooks} className={styles.loadMoreButton}>
              더보기
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default SearchForm;
