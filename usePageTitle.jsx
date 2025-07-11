import { useEffect } from 'react';

/**
 
페이지의 <title> 태그를 변경하는 커스텀 훅
@param {string} title - 문서 제목으로 설정할 문자열*/
const usePageTitle = (title) => {
  useEffect(() => {
    const $title = document.getElementsByTagName("title")[0];
    if ($title) {
      $title.innerText = title;
    }
  }, [title]);
};

export default usePageTitle;