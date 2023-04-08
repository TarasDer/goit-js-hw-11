import './css/style.css';
import { PixabayAPI } from './js/pixabay-api';
import createPhotoCard from './templates/card-template.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formSearchEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayApi = new PixabayAPI();

let gallery = new SimpleLightbox('.gallery a');

const handleSearchFoto = async ev => {
  ev.preventDefault();
  galleryEl.innerHTML = '';
  loadMoreBtnEl.classList.add('is-hidden');
  pixabayApi.page = 1;

  const serchItemEl = ev.target.elements['searchQuery'].value.trim();

  pixabayApi.q = serchItemEl;

  if (!serchItemEl) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  searchGallery();
};

async function searchGallery() {
  try {
    const { data } = await pixabayApi.fetchPhoto();

    if (data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    galleryEl.innerHTML = createPhotoCard(data.hits);

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    gallery.refresh();

    if (data.totalHits > pixabayApi.per_page) {
      loadMoreBtnEl.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

function handleLoadMoreBtnClick() {
  pixabayApi.page += 1;
  searchMorePhoto();
}

async function searchMorePhoto() {
  try {
    const { data } = await pixabayApi.fetchPhoto();

    galleryEl.insertAdjacentHTML('beforeend', createPhotoCard(data.hits));
    gallery.refresh();

    if (data.hits.length < pixabayApi.per_page) {
      loadMoreBtnEl.classList.add('is-hidden');
      return Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

formSearchEl.addEventListener('submit', handleSearchFoto);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);
