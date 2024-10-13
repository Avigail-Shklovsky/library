import books from './books.json' with { type: 'json' };
console.log(books);

// books.map(book=>{
//     console.log(book.title);
    
// })

function func(){
    let list=document.getElementById('bookList');
    list.style.backgroundColor='red'
    let ul=document.createElement('ul');
    list.appendChild(ul)
    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        let newBook=document.createElement('li')
        console.log(newBook);
        
        newBook.innerHTML=`${book.title}`;
        list.appendChild(newBook);
    }
    
}

    window.onload=func;

;