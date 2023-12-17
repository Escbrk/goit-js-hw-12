import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  input: document.querySelector('[type="text"]'),
  searchBtn: document.querySelector('[type="submit"]'),
  gallery: document.querySelector('.gallery'),
};

const params = {
  API_KEY: '41227446-81114c3a771220f4777577230',
  BASE_URL: 'https://pixabay.com/api/',
};

let lightbox = new SimpleLightbox('.gallery a');

function getGaleryItems() {
  return fetch(
    `${params.BASE_URL}?key=${params.API_KEY}&q=${refs.input.value}&image_type=photo&orientation=horizontal&safesearch=true`
  ).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }

    return resp.json();
  });
}

refs.searchBtn.addEventListener('click', onSearch);

function onSearch(e) {
  e.preventDefault();
  
  if (refs.input.value.trim() === '') {
    
    // refs.gallery.innerHTML = ''
    return iziToast.error({
      message: 'Sorry, the field must be filled in!',
      position: 'topRight',
    });
  }

  refs.gallery.innerHTML = '<span class="loader"></span>'

  getGaleryItems()
    .then(data => {
      refs.gallery.innerHTML = createMarkup(data.hits);
      lightbox.refresh();
    })
    .catch(err => console.error(err));
}

function createMarkup(arr) {
  if (arr.length === 0) {
    iziToast.error({
      message:
        'Sorry, there are no images matching <br> your search query. Please try again!',
      position: 'topRight',
    });
  }
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
    <li class='gallery-item'>
        <a href='${largeImageURL}'>
            <img src="${webformatURL}" alt="${tags}" data-source=${largeImageURL} class='gallery-img'/>
        </a>
        <div class='text-container'>
            <p>Likes<span>${likes}</span></p>
            <p>Views<span>${views}</span></p>
            <p>Comments<span>${comments}</span></p>
            <p>Downloads<span>${downloads}</span></p>
        </div>
    </li>`;
      }
    )
    .join('');
}