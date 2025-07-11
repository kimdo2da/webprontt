export async function fetchBooksByKeyword(keyword, categoryId = '', start = 1) {
  const apiUrl = `/api/aladin?ttbkey=ttbsongmh1352200001&Query=${encodeURIComponent(
    keyword
  )}&QueryType=Keyword&MaxResults=50&start=${start}&SearchTarget=Book${
    categoryId ? `&CategoryId=${categoryId}` : ''
  }&output=xml&Version=20131101`;

  const response = await fetch(apiUrl);
  const text = await response.text();

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, 'text/xml');

  const items = Array.from(xmlDoc.getElementsByTagName('item'));

  return items.map((item) => ({
    title: item.getElementsByTagName('title')[0]?.textContent || '',
    author: item.getElementsByTagName('author')[0]?.textContent || '',
    cover: item.getElementsByTagName('cover')[0]?.textContent || '',
  }));
}

//node proxy.js
//npm install react-router-dom
//npm run build
//vercel --prod