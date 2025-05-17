'use client';

import React, { useState} from 'react';
import { searchBooks } from "./api";

function BookResults({ addBook}) {
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
            image: volumeInfo.imageLinks.thumbnail,
            // add the excerpt
            description: volumeInfo.description,
        };
        addBook(newBook);
    };

  return (
    <>
      <div className="book-form-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for books..."
            value={query}
            onChange={(e) => setquery(e.target.value)}
          />
          <button className="search-button" type="submit">Search</button>
        </form>
      </div>
  
      <div className="book-result-container">
        <ul className='book-list'>
          {results.map((book) => (
            <li key={book.id}>
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
              )}
              <div className="book-info">
                <h2>{book.volumeInfo.title}</h2>
                <h3>{book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</h3>
                  {book.volumeInfo.description && (
                  <p className="book-excerpt">
                    {book.volumeInfo.description.substring(0, 400)}...
                  </p>
                  )}
              </div>
                <div className="book-add-button">
                  <button className="add-button" onClick={() => handleAdd(book)}>Add to list</button>
                </div>
            </li>
            ))}
        </ul>
      </div>
    </>
  );
  }
    
    export default BookResults;