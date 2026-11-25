'use client';

import React, { useState } from 'react';
import { searchBooks } from "./api";

function BookResults({ onAdd, savedIds }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [addingId, setAddingId] = useState(null);
    const [addError, setAddError] = useState('');

    const handleSearch = async (e) => {
      e.preventDefault();
      if (!query.trim()) return;

      setIsSearching(true);
      setError('');
      setAddError('');

      try {
        const books = await searchBooks(query);
        setResults(books);
      } catch (err) {
        setError(err.message);
        setResults([]);
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    };

    const handleAdd = async (book) => {
        const volumeInfo = book.volumeInfo;
        const newBook = {
            id: book.id,
            title: volumeInfo.title,
            authors: volumeInfo.authors || [],
            image: volumeInfo.imageLinks?.thumbnail || null,
            description: volumeInfo.description || null,
        };

        setAddingId(book.id);
        setAddError('');
        try {
          await onAdd(newBook);
        } catch (err) {
          setAddError(err.message);
        } finally {
          setAddingId(null);
        }
    };

  return (
    <>
      <div className="book-form-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-button" type="submit" disabled={isSearching}>
            {isSearching ? 'Searching…' : 'Search'}
          </button>
        </form>
        {error && <p className="form-error">{error}</p>}
        {addError && <p className="form-error">{addError}</p>}
      </div>

      <div className="book-result-container">
        {isSearching && <p className="status-message">Searching for books…</p>}
        {!isSearching && hasSearched && !error && results.length === 0 && (
          <p className="status-message">No books found for &ldquo;{query}&rdquo;. Try another search.</p>
        )}
        <ul className='book-list'>
          {results.map((book) => {
            const isSaved = savedIds?.has(book.id);
            const isAdding = addingId === book.id;

            return (
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
                    <button
                      className="add-button"
                      onClick={() => handleAdd(book)}
                      disabled={isSaved || isAdding}
                    >
                      {isSaved ? 'Added ✓' : isAdding ? 'Adding…' : 'Add to list'}
                    </button>
                  </div>
              </li>
              );
            })}
        </ul>
      </div>
    </>
  );
  }

    export default BookResults;