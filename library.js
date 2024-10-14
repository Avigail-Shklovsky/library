import books from './books.json' with { type: 'json' };
console.log(books);
const booksData=books.books;
// books.map(book=>{
//     console.log(book.title);
    
// })

function func(){

    // {
    //     "id": 1,
    //     "title": "To Kill a Mockingbird",
    //     "author": "Harper Lee",
    //     "genre": "Fiction",
    //     "published_year": 1960,
    //     "description": "A novel about the serious issues of rape and racial inequality."
    //   }
    
    const tableBody = document.querySelector('#bookTable');   
    
    booksData.forEach(item => {
        const newBook = document.createElement('tr');
        
        const idCell = document.createElement('td');
        idCell.textContent = item.id;
        newBook.appendChild(idCell);

        const titleCell= document.createElement('td');
        titleCell.textContent=item.title;
        newBook.appendChild(titleCell);
        
        const priceCell= document.createElement('td');
        priceCell.textContent=`${item.price}$`;
        newBook.appendChild(priceCell);

        const openCell = document.createElement('td');
        openCell.textContent = 'Open'
        openCell.id='openBook';
        openCell.addEventListener('click', () => openBook(item));
        newBook.appendChild(openCell);

        console.log(newBook);
        tableBody.appendChild(newBook);
    });


}

    window.onload=func;

;