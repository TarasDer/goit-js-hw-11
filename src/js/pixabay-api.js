import axios from 'axios';

export class PixabayAPI {
  #API_KEY = '35107555-f3c90346c08cd3bb4853f7523';
  #BASE_URL = 'https://pixabay.com/api/';

  page = 1;
  per_page = 40;
  q = null;

  fetchPhoto() {
    return axios.get(`${this.#BASE_URL}?`, {
      params: {
        key: this.#API_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.page,
        per_page: this.per_page,
        q: this.q,
      },
    });
  }
}
