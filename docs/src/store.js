

const store = (function(){

  function generateBookmarkElement(item) {
    return `
    <li class="bookmark-list-items js-bookmark-list-items" data-item-id="${item.id}">
      <h3 class="list-title js-list-title">${item.title}</h3>
      <section class="star-rating js-star-rating">
        <p class="star-number js-star-number">${item.rating} Stars</p>
      </section>
    </li>`;
  }


  function generateBookmarkString(bookmarkList) {
    const items = bookmarkList.map((item) => generateBookmarkElement(item));
    return items.join('');
  }


  function generateExpandedView(item){
    
    return `
      <li class="expand-bookmark-view js-expand-bookmark-view" data-item-id="${item.id}">
        <h2>${item.title}</h2>
        <form id="js-close-expanded" class="header-right js-header-right">
        <p class="expanded-stars js-expanded-stars">${item.rating} Stars</p>
          <button class="close-button js-close-button" type="submit">Close</button>
        </form>
        <p class="long-desc js-long-desc">${item.desc}</p>
        <a class="bookmark-link js-bookmark-link" href="${item.url}" target="_blank">${item.url}</a>
        <div> 
            <a class="bookmark-link js-bookmark-link" href="${item.url}" target="_blank">
            <button class="visit-site-button js-visit-site-button">Visit</button></a>
        </div>
        <form id="js-delete-bookmark">
          <button class="delete-bookmark-button js-delete-bookmark-button" type="submit">Delete</button>
        </form>
        <form id="js-edit-bookmark">
          <button class="edit-bookmark-button js-edit-bookmark-button" type="submit">Edit</button>
        </form>
      </li>`;
  }


  function generateCreateBookmarkView(item = {}) {
    return `
    <li class="create-bookmark-view js-create-bookmark-view">
      <h2>Create New Bookmark</h2>
        <form for="close-button" id="js-close-expanded" class="close-header-right js-header-right" id="close-button">
          <button class="create-close-button js-close-button" type="submit">Close</button>
        </form>
        <form id="js-add-bookmark">
          <label for="add-bookmark-title"></label>
          <input value ="${item.title || ''}" class="add-bookmark add-bookmark-title js-add-bookmark-title" id="add-bookmark-title" name="title" type="text" placeholder="Title" required>
          <label for="add-bookmark-link"></label>
          <input class="add-bookmark add-bookmark-link js-add-bookmark-link" id="add-bookmark-link" name="url" type="url" value="http://" placeholder="http://url-address.com" required>
          <label for="add-bookmark-desc"></label>
          <input class="add-bookmark add-bookmark-desc js-add-bookmark-desc" id="add-bookmark-desc" name="desc" type="text" placeholder="Add Description" align="top">
          <div id="add-star-rating js-add-star-rating">
            <div class="add-bookmark rate-radio-button js-rate-radio-buttons">
              <fieldset>
                <Legend required>Stars</Legend>
                <label for="5-stars">5</label>
                <input type="radio" id="5-stars"
                  name="rate" value="5" required>
                <label for="4-stars">4</label>
                <input type="radio" id="4-stars"
                  name="rate" value="4">
                <label for="3-stars">3</label>
                <input type="radio" id="3-stars"
                  name="rate" value="3">
                <label for="2-stars">2</label>
                <input type="radio" id="2-stars"
                  name="rate" value="2">
                <label for="1-stars">1
                <input type="radio" id="1-star"
                  name="rate" value="1">
              </fieldset>
            </div>
          </div>
          <div>
            <button class="add-button-submit js-add-button-submit" type="submit" >Add</button>
          </div>
        </form>
      </li>`;
  }


  function handleCreateBookmarkClicked() {
    $('#js-create-bookmark-form').on('submit', (function(event) {
      event.preventDefault();
      store.adding = true;
      render();
    }));
  }


  function handleCloseBookmarkClicked() {
    $('#js-close-expanded').on('click', '.js-bookmark-list-button', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      let item = store.findById(id);
      store.closing = true;
      if (store.closing && item.id === id) {
        render();
        store.closing = false;
      }
    });
  }


  function handleAddBookmarkClicked() {
    $('#js-add-bookmark').on('submit', (function(event) {
      event.preventDefault();
      const title = event.currentTarget.title.value;
      const url = event.currentTarget.url.value;
      const desc = event.currentTarget.desc.value;
      const rate = event.currentTarget.rate.value;
      console.log(`add bookmark`);

      api.createItem(title, url, desc, rate, function(response) {
        store.addItem(response);
        store.adding = false;
        render();
      });
    }));
  }


  function handleExpandViewClicked() {
    $('.js-bookmark-list').on('click', '.js-bookmark-list-items', event => {
      const id = getItemIdFromElement(event.currentTarget);
      let item = store.findById(id);
      $(event.currentTarget).remove();
      if(item.id === id) {
        const expandView = generateExpandedView(item);
        $('.js-bookmark-list').prepend(expandView);
        store.expanded = true;
      }
    });
  }


  function handleDeleteBookmarkClicked() {
    $('.js-bookmark-list').on('click', '.js-delete-bookmark-button', event => {
      const id = $(event.currentTarget.parentElement.parentElement).data('item-id');
      event.preventDefault();
      api.deleteItem(id, () => {
        store.findAndDelete(id);
        render();
      });
    });
  }


  function handleEditBookmarkSubmit(){
    $('.js-bookmark-list').on('submit', '.edit')
  }
 
  function handleEditBookmarkClicked(){
    $('.js-bookmark-list').on('click', '.js-edit-bookmark-button', event =>{
      const id = getItemIdFromElement(event.currentTarget);
      let item = store.findById(id);
      console.log(id);
      $(event.currentTarget).remove();
      if(item.id === id) {
        const expandView = generateExpandedView(item);
        $('.js-bookmark-list').prepend(expandView);
        store.expanded = true;
      }
    });
  }

  function handleFilterByRatingClicked() {
    $('.js-header-select').on('change', function(event) {
      event.preventDefault();
      const val = $(event.currentTarget).val();
      store.filterByRating(val);
      render();
    });
  }


  function getItemIdFromElement(item) {
    return $(item)
      .closest('.js-bookmark-list-items')
      .data('item-id');
  }


  function render() {
    $('.js-bookmark-list').empty();
    if(store.adding) {
      const bookmarkForm = generateCreateBookmarkView();
      $('.js-bookmark-list').prepend(bookmarkForm);
    }
    handleAddBookmarkClicked();
    let items = store.items;
    console.log('render form');
    const bookmarkString = generateBookmarkString(items);
    $('.js-bookmark-list').append(bookmarkString);
  }


  function bindEventListeners() {
    handleExpandViewClicked();
    handleCreateBookmarkClicked();
    handleFilterByRatingClicked();
    handleCloseBookmarkClicked();
    handleAddBookmarkClicked();
    handleDeleteBookmarkClicked();
    handleEditBookmarkClicked();
    //handleEditBookmarkSubmit();
  }

  return {
    render,
    bindEventListeners
  };
}());
export default store;