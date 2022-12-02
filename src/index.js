import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PictureApiService from './js/fetchRequest';

const refs = {
  searchForm: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  cardsContainer: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearchForm);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

refs.loadMoreBtn.classList.add('is-hidden');

const pictureApiService = new PictureApiService();

const gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

function onSearchForm(evt) {
  evt.preventDefault();
  refs.cardsContainer.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
  pictureApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
  if (pictureApiService.query === '') {
    refs.loadMoreBtn.classList.add('is-hidden');
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  pictureApiService.resetPage();
  pictureApiService
    .fetchRequest()
    .then(data => {
      if (data.hits.length === 0) {
        refs.cardsContainer.innerHTML = '';
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if (data.totalHits < 41) {
         renderList(data);
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      Notify.info(`We're sorry, but you've reached the end of search results.`);
      return;
    } else {
        renderList(data);
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        setTimeout(() => {
          refs.loadMoreBtn.classList.remove('is-hidden');
        }, 500);
      }
    })
    .catch(err => console.log(err));
}

function onLoadMore() {
  pictureApiService.fetchRequest().then(data => {
    renderList(data);
    const totalPages = Math.ceil(data.totalHits / pictureApiService.per_page);
    if (totalPages === pictureApiService.page - 1) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.info(`We're sorry, but you've reached the end of search results.`);
      return;
    }

    smoothScroll();
  });
}

function smoothScroll() {
  const { height: cardHeight } =
    refs.cardsContainer.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function renderList(data) {
  const markupGallery = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <a class="gallery__link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" class = "gallery__img" 
             loading="lazy" />
  <div class="info">
    <p class="info-item">
    <b>Likes</b>
    <span>${likes}</span>
    </p>
    <p class="info-item">
    <b>Views</b>
    <span>${views}</span>
    </p>
    <p class="info-item">
    <b>Comments</b>
    <span>${comments}</span>
    </p>
    <p class="info-item">
    <b>Downloads</b>
    <span>${downloads}</span>
    </p>
  </div>
  </a>
</div>`
    )
    .join('');
  refs.cardsContainer.insertAdjacentHTML('beforeend', markupGallery);
  gallery.refresh();
}

/**
  |============================
  | РЕПЕТА    https://github.com/luxplanjay/js-22/blob/12-2-rest-%D0%BF%D0%B0%D0%B3%D0%B8%D0%BD%D0%B0%D1%86%D0%B8%D1%8F/src/index.js
  |============================
*/
// const refs = {
//   searchForm: document.querySelector('.js-search-form'),
//   articlesContainer: document.querySelector('.js-articles-container'),
// };
// const loadMoreBtn = new LoadMoreBtn({
//   selector: '[data-action="load-more"]',
//   hidden: true,
// });
// const newsApiService = new NewsApiService();

// refs.searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.refs.button.addEventListener('click', fetchArticles);

// function onSearch(e) {
//   e.preventDefault();

//   newsApiService.query = e.currentTarget.elements.query.value;

//   if (newsApiService.query === '') {
//     return alert('Введи что-то нормальное');
//   }

//   loadMoreBtn.show();
//   newsApiService.resetPage();
//   clearArticlesContainer();
//   fetchArticles();
// }

// function fetchArticles() {
//   loadMoreBtn.disable();
//   newsApiService.fetchArticles().then(articles => {
//     appendArticlesMarkup(articles);
//     loadMoreBtn.enable();
//   });
// }

// function appendArticlesMarkup(articles) {
//   refs.articlesContainer.insertAdjacentHTML('beforeend', articlesTpl(articles));
// }

// function clearArticlesContainer() {
//   refs.articlesContainer.innerHTML = '';
// }