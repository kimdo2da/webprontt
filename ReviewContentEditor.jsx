import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './Header';
import usePageTitle from '../hooks/usePageTitle';
import styles from './ReviewContentEditor.module.css';

function ReviewContentEditor() {
  usePageTitle("독후감 상세");

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [content, setContent] = useState('');
  const [review, setReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!state) {
      alert('잘못된 접근입니다.');
      navigate('/');
      return;
    }

    const allReviews = JSON.parse(localStorage.getItem('bookReviews')) || [];
    let found = allReviews.find((r) => r.id === state.id);

    if (!found) {
      found = {
        id: state.id,
        title: state.title,
        author: state.author,
        cover: state.cover,
        date: state.date || new Date().toLocaleDateString(),
        content: '',
      };
      allReviews.push(found);
      localStorage.setItem('bookReviews', JSON.stringify(allReviews));
    }

    setReview(found);
    setContent(found.content || '');
  }, [state, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const existing = JSON.parse(localStorage.getItem('bookReviews')) || [];
    const updated = existing.map((r) =>
      r.id === state.id ? { ...r, content } : r
    );
    localStorage.setItem('bookReviews', JSON.stringify(updated));
    alert('내용이 저장되었습니다!');
    setIsEditing(false);
    setReview((prev) => ({ ...prev, content }));
  };

  if (!review) return null;

  return (
    <div className={styles.container}>
      <Header title="독후감 상세" onHome={() => navigate('/')} />

      <div className={styles.bookInfo}>
        {review.cover && (
          <div className={styles.coverBox}>
            <img src={review.cover} alt="표지" className={styles.coverImage} />
          </div>
        )}

        <div className={styles.textInfo}>
          <div className={styles.title}>{review.title}</div>
          <div className={styles.author}>{review.author}</div>
        </div>

        <div className={styles.dateBox}>
          <div>작성일</div>
          <div className={styles.date}>{review.date || '날짜 없음'}</div>
        </div>
      </div>

      <textarea
        rows={10}
        value={content}
        readOnly={!isEditing}
        onChange={(e) => setContent(e.target.value)}
        className={`${styles.textarea} ${isEditing ? styles.editable : styles.readonly}`}
        placeholder="이 책을 읽고 느낀 점을 자유롭게 작성해보세요."
      />

      <div className={styles.buttonGroup}>
        {isEditing ? (
          <button onClick={handleSave}>저장</button>
        ) : (
          <button onClick={handleEdit}>수정하기</button>
        )}
        <button onClick={() => navigate(-1)}>돌아가기</button>
      </div>
    </div>
  );
}

export default ReviewContentEditor;
