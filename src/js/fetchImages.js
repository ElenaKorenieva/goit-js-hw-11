import axios from 'axios';

export async function fetchImages(value, page) {
  const API_KEY = '30860486-2bc10cd6f698c5db7e18c3090';
  const BASE_URL = 'https://pixabay.com/api/';
  const filter = `?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios.get(`${BASE_URL}${filter}`).then(response => {
    return response.data;
  });
  // return fetch(`${BASE_URL}${filter}`).then(response => {
  //   if (!response.ok) {
  //     if (response.status === 404) {
  //       return [];
  //     }
  //     throw new Error(response.status);
  //   }

  //   return response.json();
  // });
}
