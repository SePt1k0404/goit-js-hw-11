import Notiflix from 'notiflix';
import axios from 'axios';

const refs = {
  formEl: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  brtMoreEl: document.querySelector('.load-more'),
};

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '38382218-99536ad77025498ca3a521a1b';
const IMAGE_TYPE = 'photo';
const IMAGE_ORIENTATION = 'horizontal';
const IMAGE_SAFESEARCH = 'true';
let countOfPage = 1;
let qValue = null;

refs.brtMoreEl.setAttribute('hidden', 'true');
refs.formEl.addEventListener('submit', formHandler);
refs.brtMoreEl.addEventListener('click', moreImageOnClick);

function moreImageOnClick(evt) {
  refs.brtMoreEl.setAttribute('hidden', 'true');
  countOfPage += 1;
  searchImage(qValue, countOfPage)
    .then(data => {
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
    })
    .catch(error => console.log(error.message));
}

function formHandler(evt) {
  evt.preventDefault();
  countOfPage = 1;
  refs.brtMoreEl.setAttribute('hidden', 'true');
  qValue = evt.target.elements[0].value;
  searchImage(qValue, countOfPage)
    .then(data => {
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
    })
    .catch(error => console.log(error.message));
}

async function searchImage(qValue, countOfPage) {
  const response = await axios.get(`?key=${API_KEY}&q=
  ${qValue}&image_type=${IMAGE_TYPE}&orientation=${IMAGE_ORIENTATION}&
  safesearch=${IMAGE_SAFESEARCH}&per_page=40&page=${countOfPage}`);
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
  refs.galleryEl.insertAdjacentHTML(
    'beforeend',
    `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
  refs.brtMoreEl.removeAttribute('hidden');
}
