import { fetchImages } from '../src/js/fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// get all elements (tags) from html page
const gallery = document.querySelector('.gallery');
const more = document.querySelector('.more');
const loading = document.querySelector('.loading');
const end = document.querySelector('.end-is-nigh');
const form = document.querySelector('.search-form');

//  status variables
let currentQuery = '';
let currentPage = 1;
let loaded = 40;
let totalHits = 0;

// Event listeners
form.addEventListener('submit', onSearchSubmit);
window.addEventListener('scroll', onScrollLoad);

// render markup with images we fetched using template string
function renderImageMarkup({ hits: images }) {
  const markup = images
    .map(image => {
      return `
  <div class='photo-card'>
  <a href='${image.largeImageURL}'>
    <img src='${image.webformatURL}' alt='${image.tags}' class="photo__link" loading='lazy' />
  </a>
  <div class='info'>
    <p class='info-item'>
      <span class = 'info-icon likes'></span>
      <b>Likes</b>
      ${image.likes}
    </p>
    <p class='info-item'>
    <span class = 'info-icon views'></span>
      <b>Views</b>
      ${image.views}
    </p>
    <p class='info-item'>
    <span class = 'info-icon comments'></span>
      <b>Comments</b>
      ${image.comments}
    </p>
    <p class='info-item'>
    <span class = 'info-icon downloads'></span>
      <b>Downloads</b>
      ${image.downloads}
    </p>
  </div>
</div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

// function for creation and showing lightbox
function createLightbox() {
  let lightbox = new SimpleLightbox('.photo-card a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  });
}

// submit event handler. We wait for data fetching and render markup
async function onSearchSubmit(e) {
  try {
    e.preventDefault();
    gallery.innerHTML = '';
    currentPage = 1;
    currentQuery = e.currentTarget.searchQuery.value.trim();

    const fetchedData = await fetchImages(currentQuery, currentPage);
    totalHits = fetchedData.totalHits;
    console.log(totalHits === 0);

    if (totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    renderImageMarkup(fetchedData);
    createLightbox();
  } catch (error) {
    console.log(error.message);
  }
}

// scroll handler. We download more images whem we scroll down to the end of the page
async function onScrollLoad() {
  try {
    if (
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight
    ) {
      if (loaded >= totalHits) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        window.removeEventListener('scroll', onScrollLoad);
      }
      currentPage += 1;
      loaded += 40;
      const fetchedData = await fetchImages(currentQuery, currentPage);
      renderImageMarkup(fetchedData);
      createLightbox();
      smoothScroll();
    }
  } catch (error) {
    console.log(error.message);
  }
}

// Smooth scroll
function smoothScroll() {
  const { height: cardHeight } =
    galleryRef.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
