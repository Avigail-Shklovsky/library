import books from './books.json' with { type: 'json' };

console.log(books);
let originalBooksData = [...books.books];
let booksData = [...originalBooksData];

// let currentPage = 1;
// const itemsPerPage = 3;

let titleSortState = 'unsorted';
let priceSortState = 'unsorted';

function createTable() {

    const tableBody = document.querySelector('#bookTable');
    tableBody.innerHTML = '';

    const titleRow = document.createElement('tr');
    titleRow.id = 'titleRow';

    const id = document.createElement('td')
    id.textContent = 'ID';
    titleRow.appendChild(id);

    const titleRootContainer = document.createElement('td');
    const titleContainer = document.createElement('span');
    titleContainer.id = 'titleContainer';
    const title = document.createElement('span');
    title.textContent = 'Title';
    let iconSortTitle = document.createElement('span');
    iconSortTitle.id = 'sortTitleIcon';
    if (titleSortState === 'asc') {
        iconSortTitle.innerHTML = `<span class="iconify" data-icon="fa6-solid:sort-up" style="color: black;"></span>`;
    } else if (titleSortState === 'desc') {
        iconSortTitle.innerHTML = `<span class="iconify" data-icon="fa6-solid:sort-down" style="color: black;"></span>`;
    } else {
        iconSortTitle.innerHTML = `<span class="iconify" data-icon="fa6-solid:sort" style="color: black;"></span>`;
    }
    titleContainer.addEventListener('click', () => sortTitle(iconSortTitle));
    titleContainer.appendChild(title);
    titleContainer.appendChild(iconSortTitle);
    titleRootContainer.appendChild(titleContainer);
    titleRow.appendChild(titleRootContainer);



    const priceContainer = document.createElement('td')
    priceContainer.id = 'priceContainer';
    const price = document.createElement('span');
    price.textContent = 'Price';
    let iconSortPrice = document.createElement('span');
    iconSortPrice.id = 'sortPriceIcon';
    if (priceSortState === 'asc') {
        iconSortPrice.innerHTML = `<span class="iconify" data-icon="fa6-solid:sort-up" style="color: black;"></span>`;
    } else if (priceSortState === 'desc') {
        iconSortPrice.innerHTML = `<span class="iconify" data-icon="fa6-solid:sort-down" style="color: black;"></span>`;
    } else {
        iconSortPrice.innerHTML = `<span class="iconify" data-icon="fa6-solid:sort" style="color: black;"></span>`;
    }
    priceContainer.addEventListener('click', () => sortPrice(iconSortPrice));
    priceContainer.appendChild(price);
    priceContainer.appendChild(iconSortPrice);
    titleRow.appendChild(priceContainer);

    const action = document.createElement('td');
    action.textContent = 'Action';
    action.colSpan = 3;
    action.style.textAlign = 'center';
    titleRow.appendChild(action);

    tableBody.appendChild(titleRow)


    booksData.forEach(item => {
        const newBook = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = item.id;
        newBook.appendChild(idCell);

        const titleCell = document.createElement('td');
        titleCell.textContent = item.title;
        newBook.appendChild(titleCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = `${item.price}$`;
        priceCell.style.textAlign = 'center'
        newBook.appendChild(priceCell);

        const openCell = document.createElement('td');
        openCell.textContent = 'Open'
        // openCell.id='openBook';
        openCell.addEventListener('click', () => openBook(item));
        newBook.appendChild(openCell);

        const updateCell = document.createElement('td');
        updateCell.textContent = 'Update';
        updateCell.id = 'updateBook';
        updateCell.addEventListener('click', () => updateBook(item));
        newBook.appendChild(updateCell);

        const deleteCell = document.createElement('td');
        const deleteIcon = document.createElement('span');
        deleteIcon.innerHTML = `<span class="iconify" data-icon="tabler:trash"></span>`;
        deleteIcon.style.position = 'center';
        deleteCell.addEventListener('click', () => deleteBook(item));
        deleteCell.appendChild(deleteIcon);
        newBook.appendChild(deleteCell);


        console.log(newBook);
        tableBody.appendChild(newBook);
    });




}

function sortTitle(icon) {
    if (titleSortState === 'unsorted') {
        titleSortState = 'asc';
    } else if (titleSortState === 'asc') {
        titleSortState = 'desc';
    } else {
        titleSortState = 'unsorted';
    }

    icon.innerHTML = '';

    switch (titleSortState) {
        case 'asc':
            booksData.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'desc':
            booksData.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'unsorted':
            booksData = [...originalBooksData];
            break;
    }

    createTable();
}


function sortPrice(icon) {
    if (priceSortState === 'unsorted') {
        priceSortState = 'asc';
    } else if (priceSortState === 'asc') {
        priceSortState = 'desc';
    } else {
        priceSortState = 'unsorted';
    }

    switch (priceSortState) {
        case 'asc':
            booksData.sort((a, b) => a.price - b.price);
            break;
        case 'desc':
            booksData.sort((a, b) => b.price - a.price);
            break;
        case 'unsorted':
            booksData = [...originalBooksData];
            break;
    }

    createTable();
}

function openBook(book) {
    let bookDiv = document.querySelector('#openBook');

    // prevent duplicates
    bookDiv.innerHTML = '';

    const textDiv = document.createElement('div');

    const title = document.createElement('h1');
    title.textContent = book.title;

    const author = document.createElement('h4');
    author.textContent = `Author: ${book.author}`;

    const genre = document.createElement('h4');
    genre.textContent = `Genre: ${book.genre}`;

    const published_year = document.createElement('h4');
    published_year.textContent = `Published Year: ${book.published_year}`;

    const description = document.createElement('h4');
    description.textContent = `Description: ${book.description}`; 

    const price = document.createElement('h4');
    price.textContent = `Price: ${book.price}$`; 

    const image = document.createElement('img');
    image.src = book.image;
    image.alt = book.title;
    // image.style.width = '300px';
    // image.style.height = 'auto'

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
        bookDiv.style.display = 'none';
    });


    textDiv.appendChild(title);
    textDiv.appendChild(author);
    textDiv.appendChild(genre);
    textDiv.appendChild(published_year);
    textDiv.appendChild(description);
    textDiv.appendChild(price);
    textDiv.appendChild(closeButton);
    bookDiv.appendChild(image);
    bookDiv.appendChild(textDiv);


    bookDiv.style.display = 'flex';
}

function updateBook() {

}

function deleteBook() {

}
window.onload = createTable;

