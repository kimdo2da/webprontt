// 서버리스 함수: api/aladin.js (루트 경로에 api 폴더 만들고 안에 넣어)
export default async function handler(req, res) {
  const query = req.url.split('?')[1];
  const apiUrl = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?${query}`;

  try {
    const response = await fetch(apiUrl);
    const text = await response.text();
    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(text);
  } catch (err) {
    console.error('알라딘 API 호출 실패:', err);
    res.status(500).json({ error: 'API 호출 실패' });
  }
}