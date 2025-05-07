'use client';

import React, { useState} from 'react';
import { searchBooks } from "./api";

function BookSearch({ addBook}) {
    const [query, setquery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
      e.preventDefault(); 
      if (!query) return; 
      
      const books = await searchBooks(query);
      setResults(books);
    };
  

    const handleAdd = (book) => {
        const volumeInfo = book.volumeInfo;
        const newBook = {
            id: book.id,
            title: volumeInfo.title,
            authors: volumeInfo.authors,
            image: volumeInfo.imageLinks.thumbnail
        };
        addBook(newBook);
    };

  return (
      <div className="book-result-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for books..."
            value={query}
            onChange={(e) => setquery(e.target.value)}
          />
          <button className="search-button" type="submit">Search</button>
        </form>
  
        <ul className='book-list'>
          {results.map((book) => (
            <li key={book.id}>
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
              )}
              <div>
                <strong>{book.volumeInfo.title}</strong><br />
                {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
              </div>
              <button onClick={() => handleAdd(book)}>Add</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
    
    export default BookSearch;