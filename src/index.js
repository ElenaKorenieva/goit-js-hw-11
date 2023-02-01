import { fetchImages } from '../src/js/fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { debounce } from 'debounce';

// get all elements (tags) from html page
const gallery = document.querySelector('.gallery');
// const totalHits = document.querySelector('.total-hits');
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

// render markup
function renderImageMarkup({ hits: images }) {
  const markup = images
    .map(image => {
      return `
    <div class="photo-card">
    <a href="${image.largeImageURL}"><img class="photo__link" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>
    <div class="info">
    <p class="info-item">
<b>Likes</b> <span class="info-item__api"> ${image.likes} </span>
</p>
    <p class="info-item">
        <b>Views</b> <span class="info-item__api">${image.views}</span>  
    </p>
    <p class="info-item">
        <b>Comments</b> <span class="info-item__api">${image.comments}</span>  
    </p>
    <p class="info-item">
        <b>Downloads</b> <span class="info-item__api">${image.downloads}</span> 
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

// submit event handler
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

// scroll handler
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
