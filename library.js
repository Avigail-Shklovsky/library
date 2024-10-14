import books from './books.json' with { type: 'json' };
console.log(books);
const booksData=books.books;


function createTable(){

    // {
    //     "id": 1,
    //     "title": "To Kill a Mockingbird",
    //     "author": "Harper Lee",
    //     "genre": "Fiction",
    //     "published_year": 1960,
    //     "description": "A novel about the serious issues of rape and racial inequality."
    //   }
    
    const tableBody = document.querySelector('#bookTable');  

    const titleRow=document.createElement('tr');
    titleRow.id='titleRow';

    const id=document.createElement('td')
    id.textContent='ID'; 
    titleRow.appendChild(id);

    const title=document.createElement('td')
    title.textContent='Title';
    titleRow.appendChild(title);


    const price=document.createElement('td');
    price.textContent='Price';
    price.innerHTML += '<span class="iconify" data-icon="i-fa6-solid:sort-up w-1em h-1em" style="color: black;"></span>';

    // const iconSort=document.createElement('span')
    // iconSort.className='i-fa6-solid:sort-up w-1em h-1em';
    // iconSort.style.color='black';
    // price.appendChild(iconSort)
    titleRow.appendChild(price);

    const action =document.createElement('td');
    action.textContent='Action';
    action.colSpan = 2; 
    action.style.textAlign = 'center';
    titleRow.appendChild(action);

    tableBody.appendChild(titleRow)

    
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

        const updateCell=document.createElement('td');
        updateCell.textContent='Update';
        updateCell.id='updateBook';
        updateCell.addEventListener('click', () => updateBook(item));
        newBook.appendChild(updateCell);

        console.log(newBook);
        tableBody.appendChild(newBook);
    });


}

    window.onload=createTable;

;