import store from './store.js';
import api from './api.js';
import bookmarkList from './bookmarkList.js';


const main = function() {
  api.getBookmarks()
    .then(items => {
      items.forEach(item => store.addItem(item));
      bookmarkList.render();
    });
    bookmarkList.bindEventListeners();
    bookmarkList.render();
};

$(main);