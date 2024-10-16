import books from './books.json' with { type: 'json' };

// Initializing the book data
let originalBooksData = [...books.books];
let booksData = [...originalBooksData];

if (!localStorage.getItem('booksArray')) {
    localStorage.setItem('booksArray', JSON.stringify(originalBooksData));
}

// Variables for pagination and sorting
let currentPage = 0;
const itemsPerPage = 5;
let maxPages = Math.ceil(getBooksArrayFromLocalStorage().length / itemsPerPage);

let titleSortState = 'unsorted';
let priceSortState = 'unsorted';

// DOM Elements
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const pageNumbers = document.getElementById('pageNumbers');
const tableBody = document.querySelector('#bookTable');

// Retrieve books array from local storage
function getBooksArrayFromLocalStorage() {
    const bookArray = localStorage.getItem('booksArray');
    return bookArray ? JSON.parse(bookArray) : [];
}

// Get the paginated books for the current page
function getPaginatedBooks() {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    console.log(getBooksArrayFromLocalStorage().length); 
    let books = booksData.slice(start, end);
    
    return books;
}

function createTable() {
    const currentBooks = getPaginatedBooks();
    tableBody.innerHTML = ''; // Clear existing table rows

    // Table header with sorting icons
    const titleRow = document.createElement('tr');
    titleRow.id = 'titleRow';

    // Header ID
    const id = document.createElement('td');
    id.textContent = 'ID';
    titleRow.appendChild(id);

    // Header Title with sorting icon
    const titleRootContainer = document.createElement('td');
    const titleContainer = document.createElement('span');
    titleContainer.id = 'titleContainer';
    const title = document.createElement('span');
    title.textContent = 'Title';
    
    const iconSortTitle = document.createElement('span');
    iconSortTitle.id = 'sortTitleIcon';
    iconSortTitle.innerHTML = getSortIcon(titleSortState);
    titleContainer.addEventListener('click', () => sortTitle(iconSortTitle));
    
    titleContainer.appendChild(title);
    titleContainer.appendChild(iconSortTitle);
    titleRootContainer.appendChild(titleContainer);
    titleRow.appendChild(titleRootContainer);

    // Header Price with sorting icon
    const priceContainer = document.createElement('td');
    priceContainer.id = 'priceContainer';
    const price = document.createElement('span');
    price.textContent = 'Price';

    const iconSortPrice = document.createElement('span');
    iconSortPrice.id = 'sortPriceIcon';
    iconSortPrice.innerHTML = getSortIcon(priceSortState);
    priceContainer.addEventListener('click', () => sortPrice(iconSortPrice));

    priceContainer.appendChild(price);
    priceContainer.appendChild(iconSortPrice);
    titleRow.appendChild(priceContainer);

    // Header Action
    const action = document.createElement('td');
    action.textContent = 'Action';
    action.colSpan = 3;
    action.style.textAlign = 'center';
    titleRow.appendChild(action);

    tableBody.appendChild(titleRow);

    // Create book rows
    currentBooks.forEach(item => {
        const newBook = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = item.id;
        newBook.appendChild(idCell);

        const titleCell = document.createElement('td');
        titleCell.textContent = item.title;
        newBook.appendChild(titleCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = `${item.price}$`;
        newBook.appendChild(priceCell);

        const openCell = document.createElement('td');
        openCell.textContent = 'Open';
        openCell.addEventListener('click', () => openBook(item));
        newBook.appendChild(openCell);

        const updateCell = document.createElement('td');
        updateCell.textContent = 'Update';
        updateCell.addEventListener('click', () => updateBook(item));
        newBook.appendChild(updateCell);

        const deleteCell = document.createElement('td');
        const deleteIcon = document.createElement('span');
        deleteIcon.innerHTML = `<span class="iconify" data-icon="tabler:trash"></span>`;
        deleteCell.addEventListener('click', () => {
            deleteCell.classList.add('clicked');
            setTimeout(() => {
                deleteCell.classList.remove('clicked');
                deleteBook(item); // Proceed with the delete action after feedback
            }, 300); // Delay to remove the class after animation (in ms)
        });        deleteCell.appendChild(deleteIcon);
        newBook.appendChild(deleteCell);

        tableBody.appendChild(newBook);
    });

    renderPageNumbers();
}

// Get the appropriate sorting icon based on sort state
function getSortIcon(sortState) {
    if (sortState === 'asc') {
        return `<span class="iconify" data-icon="fa6-solid:sort-up" style="color: black;"></span>`;
    } else if (sortState === 'desc') {
        return `<span class="iconify" data-icon="fa6-solid:sort-down" style="color: black;"></span>`;
    }
    return `<span class="iconify" data-icon="fa6-solid:sort" style="color: black;"></span>`;
}

// Pagination: Render page numbers
function renderPageNumbers() {
    pageNumbers.innerHTML = '';
    for (let i = 0; i < maxPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i + 1;
        btn.classList.add('page-btn');
        if (i === currentPage) btn.classList.add('active');
        btn.addEventListener('click', () => goToPage(i));
        pageNumbers.appendChild(btn);
    }
}

// Change the current page
function goToPage(pageIndex) {
    currentPage = pageIndex;
    createTable();
    renderPageNumbers();
}

// Sorting: Sort by title
function sortTitle(icon) {
    titleSortState = getNextSortState(titleSortState);
    booksData = sortBooks(booksData, 'title', titleSortState);
    icon.innerHTML = getSortIcon(titleSortState);
    createTable();
}

// Sorting: Sort by price
function sortPrice(icon) {
    priceSortState = getNextSortState(priceSortState);
    booksData = sortBooks(booksData, 'price', priceSortState);
    icon.innerHTML = getSortIcon(priceSortState);
    createTable();
}

// Get the next sorting state (asc, desc, unsorted)
function getNextSortState(currentState) {
    return currentState === 'unsorted' ? 'asc' : currentState === 'asc' ? 'desc' : 'unsorted';
}

// Sort books array based on the field and sort order
function sortBooks(data, field, sortState) {
    if (sortState === 'asc') return data.sort((a, b) => a[field] > b[field] ? 1 : -1);
    if (sortState === 'desc') return data.sort((a, b) => a[field] < b[field] ? 1 : -1);
    return getBooksArrayFromLocalStorage(); // Return original data for 'unsorted'
}

// Open book details in modal
function openBook(book) {
    const bookDiv = document.querySelector('#openBook');
    const buttonDiv = document.querySelector('#addBook');
    buttonDiv.style.top = '26vw';
    bookDiv.innerHTML = ''; // Clear previous content

    const textDiv = document.createElement('div');
    textDiv.innerHTML = `
        <h1>${book.title}</h1>
        <h4>Author: ${book.author}</h4>
        <h4>Genre: ${book.genre}</h4>
        <h4>Published Year: ${book.published_year}</h4>
        <h4>Description: ${book.description}</h4>
        <h4>Price: ${book.price}$</h4>
        <button>Close</button>
    `;
    const image = document.createElement('img');
    image.src = book.image;
    image.alt = book.title;

    const closeButton = textDiv.querySelector('button');
    closeButton.addEventListener('click', () => {
        bookDiv.style.display = 'none';
        buttonDiv.style.top = '12vw';
    });

    bookDiv.appendChild(image)
    bookDiv.appendChild(textDiv);
    bookDiv.style.display = 'flex';
}

// Initialize the modal for adding a new book
function newBook() {
    const modal = document.getElementById("bookModal");
    const openModalButton = document.getElementById("addBook");
    const closeModalButton = document.getElementsByClassName("close")[0];
    const bookForm = document.getElementById("bookForm");

    openModalButton.onclick = function() {
        modal.style.display = "block";
        openModalButton.style.display = 'none';
    };

    closeModalButton.onclick = function() {
        modal.style.display = "none";
        openModalButton.style.display = 'block';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    bookForm.onsubmit = function(event) {
        event.preventDefault();

        let bookArray = getBooksArrayFromLocalStorage();
        const newBook = {
            id: bookArray.length + 1,
            title: document.getElementById("title").value,
            author: document.getElementById("author").value,
            genre: document.getElementById("genre").value,
            published_year: document.getElementById("published_year").value,
            description: document.getElementById("description").value,
            price: document.getElementById("price").value,
            image: document.getElementById("image").value
        };

        bookArray.push(newBook);
        localStorage.setItem('booksArray', JSON.stringify(bookArray));
        booksData = getBooksArrayFromLocalStorage();
        maxPages = Math.ceil(booksData.length / itemsPerPage);
        createTable();

        modal.style.display = "none";
        openModalButton.style.display = 'block';
        bookForm.reset();
    };
}

// Delete a book and update the list
function deleteBook(bookToDelete) {
    // Get the current books array from localStorage
    let booksArray = getBooksArrayFromLocalStorage();

    // Filter out the book to delete
    booksArray = booksArray.filter(book => book.id !== bookToDelete.id);

    // Update the localStorage with the new array (without the deleted book)
    localStorage.setItem('booksArray', JSON.stringify(booksArray));

    // Re-sync booksData and originalBooksData with the new array
    booksData = [...booksArray];
    originalBooksData = [...booksArray];

    // Recalculate the number of pages
    maxPages = Math.ceil(booksData.length / itemsPerPage);

    // Reset to the first page and re-render the table
    currentPage = 0;
    createTable();
    renderPageNumbers();
}


// Initialize page navigation buttons and the first table creation
prevButton.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        createTable();
    }
});

nextButton.addEventListener('click', () => {
    if (currentPage < maxPages - 1) {
        currentPage++;
        createTable();
    }
});

// base case to website
window.onload = function() {
    booksData = getBooksArrayFromLocalStorage();
    if (booksData.length > 0) {
        maxPages = Math.ceil(booksData.length / itemsPerPage);
        createTable();
        renderPageNumbers();
        newBook()
    }
};