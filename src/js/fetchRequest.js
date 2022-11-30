import axios from 'axios';

export default class PictureApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchRequest() {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '31648463-5bfd0821986873c6b73af9bf8';
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`;

    return await axios.get(url).then(async response => {
      try {
        this.page += 1;
        return response.data;
      } catch (error) {
        console.log(error);
      }
    });
  }

  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
