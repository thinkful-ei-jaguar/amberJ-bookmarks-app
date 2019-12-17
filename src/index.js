import bookmarks from './bookmarks.js';
import store from './store.js';
import api from './api.js';


const main = function() {
  api.getBookmarks()
    .then(items => {
      items.forEach(item => store.addItem(item));
      bookmarks.render();
    });
  bookmarks.bindEventListeners();
  bookmarks.render();
};

$(main);