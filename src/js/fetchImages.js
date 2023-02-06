import axios from 'axios';

export async function fetchImages(value, page) {
  const BASE_URL = 'https://pixabay.com/api/?';
  const searchParams = new URLSearchParams({
    key: '30860486-2bc10cd6f698c5db7e18c3090',
    q: `${value}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: `${page}`,
  });

  return await axios.get(`${BASE_URL}${searchParams}`).then(response => {
    return response.data;
  });
}
