import Notiflix from 'notiflix';
import axios from 'axios';

const refs = {
  formEl: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  brtMoreEl: document.querySelector('.load-more'),
  endOfListEL: document.querySelector('.end-message'),
};

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '38382218-99536ad77025498ca3a521a1b';
const IMAGE_TYPE = 'photo';
const IMAGE_ORIENTATION = 'horizontal';
const IMAGE_SAFESEARCH = 'true';
const NUMBER_OF_IMAGE = 40;
let countOfPage = 1;
let qValue = null;
let totalHits = null;

refs.brtMoreEl.classList.toggle('hidden');
refs.formEl.addEventListener('submit', formHandler);
refs.brtMoreEl.addEventListener('click', moreImageOnClick);

async function moreImageOnClick() {
  countOfPage += 1;
  try {
    const data = await searchImage(qValue, countOfPage);
    refs.brtMoreEl.classList.toggle('hidden');
    totalHits -= NUMBER_OF_IMAGE;
    if (totalHits <= NUMBER_OF_IMAGE) {
      refs.brtMoreEl.classList.add('hidden');
      refs.endOfListEL.classList.remove('hidden');
    }
    data.hits.forEach(item => {
      renderMarkup(
        item.webformatURL,
        item.largeImageURL,
        item.tags,
        item.views,
        item.likes,
        item.comments,
        item.downloads
      );
    });
    refs.brtMoreEl.classList.toggle('hidden');
  } catch (error) {
    Notiflix.Notify.failure(`Sorry, ${error.message}`);
  }
}

async function formHandler(evt) {
  evt.preventDefault();
  countOfPage = 1;
  qValue = evt.target.elements[0].value.trim();
  refs.brtMoreEl.classList.remove('hidden');
  refs.endOfListEL.classList.add('hidden');
  if (qValue === '') {
    Notiflix.Notify.failure('Sorry, the search must not be empty');
  } else {
    try {
      const data = await searchImage(qValue, countOfPage);
      totalHits = data.totalHits;
      console.log(totalHits);
      if (totalHits <= NUMBER_OF_IMAGE) {
        refs.brtMoreEl.classList.add('hidden');
        refs.endOfListEL.classList.remove('hidden');
      }
      if (!data.hits.length) {
        refs.galleryEl.innerHTML = '';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        refs.galleryEl.innerHTML = '';
        data.hits.forEach(item => {
          renderMarkup(
            item.webformatURL,
            item.largeImageURL,
            item.tags,
            item.views,
            item.likes,
            item.comments,
            item.downloads
          );
        });
      }
    } catch (error) {
      Notiflix.Notify.failure(`Sorry, ${error.message}`);
    }
  }
}

async function searchImage(qValue, countOfPage) {
  const response = await axios.get(`?key=${API_KEY}&q=
  ${qValue}&image_type=${IMAGE_TYPE}&orientation=${IMAGE_ORIENTATION}&
  safesearch=${IMAGE_SAFESEARCH}&per_page=${NUMBER_OF_IMAGE}&page=${countOfPage}`);
  const imagesInfo = await response.data;
  return imagesInfo;
}

function renderMarkup(
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads
) {
  refs.brtMoreEl.classList.toggle('hidden');
  refs.galleryEl.insertAdjacentHTML(
    'beforeend',
    `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="100%" height="300"/>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`
  );
}
