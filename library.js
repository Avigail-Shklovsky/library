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
    console.log(currentBooks);
    
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
        console.log(item.ranking);
        
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
                deleteBook(item)
            }, 300); 
        });        
        deleteCell.appendChild(deleteIcon);
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

    console.log(book.ranking);
    

    const textDiv = document.createElement('div');
    textDiv.innerHTML = `
        <h1>${book.title}</h1>
        <h4>Author: ${book.author}</h4>
        <h4>Genre: ${book.genre}</h4>
        <h4>Published Year: ${book.published_year}</h4>
        <h4>Description: ${book.description}</h4>
        <h4>Price: ${book.price}$</h4>
        <div id="rank">
        <button class="rank" id="rankDown">-</button>
        <h4>Ranking: <span id="ranking">${book.ranking}</span></h4>
        <button id="rankUp" class="rank">+</button>
                 </div>
        <button id="closeButton">Close</button>
    `;
    
    const image = document.createElement('img');
    image.src = book.image;
    image.alt = book.title;

    const closeButton = textDiv.querySelector('#closeButton');
    closeButton.addEventListener('click', () => {
        bookDiv.style.display = 'none';
        buttonDiv.style.top = '12vw';
    });

    const rankUpButton = textDiv.querySelector('#rankUp');
    rankUpButton.addEventListener('click', () => {
        if (book.ranking < 10) { // Ensure the ranking does not exceed 10
            book.ranking++;
            updateRankingDisplay(book.ranking);
            updateBookInLocalStorage(book); // Update the local storage
        }
    });

    const rankDownButton = textDiv.querySelector('#rankDown');
    rankDownButton.addEventListener('click', () => {
        if (book.ranking > 0) { // Ensure the ranking does not fall below 0
            book.ranking--;
            updateRankingDisplay(book.ranking);
            updateBookInLocalStorage(book); // Update the local storage
        }
    });

    function updateRankingDisplay(ranking) {
        textDiv.querySelector('#ranking').textContent = ranking;
    }

    bookDiv.appendChild(image);
    bookDiv.appendChild(textDiv);
    bookDiv.style.display = 'flex';
}

// updates the book after ranking
function updateBookInLocalStorage(updatedBook) {
    let booksArray = getBooksArrayFromLocalStorage(); // Fetch current books array

    // Find the index of the book to update
    const bookIndex = booksArray.findIndex(book => book.id === updatedBook.id);
    if (bookIndex !== -1) {
        // Update the book at that index
        booksArray[bookIndex] = updatedBook;
        localStorage.setItem('booksArray', JSON.stringify(booksArray)); // Update local storage
    }
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
            image: document.getElementById("image").value,
            ranking: 0
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
    console.log("Book to delete:", bookToDelete); // Log the book to delete
    // Get the current books array from localStorage
    let booksArray = getBooksArrayFromLocalStorage();
    console.log("Current Books Array:", booksArray); // Log the current array

    // Filter out the book to delete
    booksArray = booksArray.filter(book => book.id !== bookToDelete.id);

    // Reassign IDs to ensure they are unique and sequential
    booksArray = booksArray.map((book, index) => {
        book.id = index + 1; // Reassign ID starting from 1
        return book;
    });

    // Update the localStorage with the new array (without the deleted book)
    localStorage.setItem('booksArray', JSON.stringify(booksArray));
    console.log("Updated Books Array:", booksArray); // Log the updated array

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

// update book details
function updateBook(bookToUpdate) {
    const modal = document.getElementById("bookModal");
    const openModalButton = document.getElementById("addBook");
    const closeModalButton = document.getElementsByClassName("close")[0];
    const bookForm = document.getElementById("bookForm");
    const modalTitle = modal.querySelector("h2");
    const submitButton = bookForm.querySelector("button[type='submit']");

    // Set the modal title and button text for updating
    modalTitle.textContent = "Update Book";
    submitButton.textContent = "Update Book"; // Change button text

    // Populate the form fields with the current book data
    document.getElementById("title").value = bookToUpdate.title;
    document.getElementById("author").value = bookToUpdate.author;
    document.getElementById("genre").value = bookToUpdate.genre;
    document.getElementById("published_year").value = bookToUpdate.published_year;
    document.getElementById("description").value = bookToUpdate.description;
    document.getElementById("price").value = bookToUpdate.price;
    document.getElementById("image").value = bookToUpdate.image;
    document.getElementById("rankingForm").value = bookToUpdate.ranking;


    // Show the modal
    modal.style.display = "block";
    openModalButton.style.display = 'none'; // Hide the "Add Book" button while editing

    closeModalButton.onclick = function () {
        modal.style.display = "none";
        openModalButton.style.display = 'block'; // Show the "Add Book" button again when closed
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            openModalButton.style.display = 'block'; // Show the "Add Book" button again when closed
        }
    };

    // Override the form submission to handle the update
    bookForm.onsubmit = function (event) {
        event.preventDefault();

        // Get the current books array from localStorage
        let booksArray = getBooksArrayFromLocalStorage();

        // Find the book in the array and update its details
        const updatedBook = {
            id: bookToUpdate.id, // Keep the same ID
            title: document.getElementById("title").value,
            author: document.getElementById("author").value,
            genre: document.getElementById("genre").value,
            published_year: parseInt(document.getElementById("published_year").value),
            description: document.getElementById("description").value,
            price: parseFloat(document.getElementById("price").value),
            image: document.getElementById("image").value,
            ranking: document.getElementById("rankingForm").value
        };

        // Replace the old book with the updated book in the array
        booksArray = booksArray.map(book => book.id === bookToUpdate.id ? updatedBook : book);

        // Update the localStorage with the updated array
        localStorage.setItem('booksArray', JSON.stringify(booksArray));

        // Re-sync booksData and originalBooksData with the updated array
        booksData = [...booksArray];
        originalBooksData = [...booksArray];

        // Recalculate the number of pages
        maxPages = Math.ceil(booksData.length / itemsPerPage);

        // Reset to the first page and re-render the table
        currentPage = 0;
        createTable();
        renderPageNumbers();

        // Close the modal and reset the form
        modal.style.display = "none";
        bookForm.reset();
        openModalButton.style.display = 'block'; // Show the "Add Book" button again
    };
}

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