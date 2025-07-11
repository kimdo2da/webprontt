import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import Header from './Header';
import styles from './ReviewList.module.css';

function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  usePageTitle("독후감 목록");

  useEffect(() => {
    const storedReviews = localStorage.getItem('bookReviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    const confirmDelete = window.confirm("정말 선택한 독후감을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    const updated = reviews.filter((review) => !selectedIds.includes(review.id));
    setReviews(updated);
    setSelectedIds([]);
    localStorage.setItem('bookReviews', JSON.stringify(updated));
  };

  const handleReviewClick = (review) => {
    navigate('/review/write/content', { state: review });
  };

  return (
    <div className={styles.pageWrapper}>
      <Header title="독후감 목록" />

      <div className={styles.container}>
        {reviews.length === 0 ? (
          <p className={styles.emptyText}>아직 작성된 독후감이 없습니다.</p>
        ) : (
          <>
            <ul className={styles.reviewList}>
              {reviews.map((review) => (
                <li
                  key={review.id}
                  onClick={() => handleReviewClick(review)}
                  className={styles.reviewItem}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(review.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleSelect(review.id)}
                    className={styles.checkbox}
                  />
                  <img
                    src={review.cover}
                    alt={review.title}
                    className={styles.cover}
                  />
                  <div className={styles.info}>
                    <div className={styles.title}>{review.title}</div>
                    <div className={styles.author}>{review.author}</div>
                    <div className={styles.date}>작성일: {review.date}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.buttonWrapper}>
              <button
                onClick={handleBulkDelete}
                className={styles.deleteButton}
                disabled={selectedIds.length === 0}
              >
                선택 삭제
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReviewList;