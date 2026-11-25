'use client';

import React, { useState } from 'react';

const SPINE_COLORS = [
  '#7f1d1d',
  '#1e3a5f',
  '#14532d',
  '#78350f',
  '#581c45',
  '#854d0e',
  '#134e4a',
  '#374151',
];

const SHELF_COUNT = 5;
const SHELF_CAPACITY = 10;

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getSpineStyle(id) {
  const hash = hashString(id);
  const hash2 = hashString(`${id}-w`);
  const color = SPINE_COLORS[hash % SPINE_COLORS.length];
  const height = 112 + (hash % 6) * 13;
  const width = 30 + (hash2 % 6) * 5;
  return { color, height, width };
}

function chunkIntoShelves(books) {
  const shelves = [];
  let remaining = books;
  for (let i = 0; i < SHELF_COUNT; i++) {
    if (i === SHELF_COUNT - 1) {
      shelves.push(remaining);
    } else {
      shelves.push(remaining.slice(0, SHELF_CAPACITY));
      remaining = remaining.slice(SHELF_CAPACITY);
    }
  }
  return shelves;
}

function BookSpine({ book, isRemoving, onRemove }) {
  const { color, height, width } = getSpineStyle(book.id);
  const hasCover = Boolean(book.image);

  return (
    <div
      className={`book-spine${hasCover ? ' book-spine-cover' : ''}`}
      style={{
        height: `${height}px`,
        width: `${width}px`,
        backgroundColor: hasCover ? undefined : color,
        backgroundImage: hasCover ? `url(${book.image})` : undefined,
      }}
      title={book.title}
    >
      <button
        type="button"
        className="book-spine-remove"
        onClick={() => onRemove(book)}
        disabled={isRemoving}
        aria-label={`Remove ${book.title} from your list`}
      >
        {isRemoving ? '…' : '×'}
      </button>
      {!hasCover && <span className="book-spine-title">{book.title}</span>}
    </div>
  );
}

function MyBooks({ books, isLoading, error, onRemove }) {
  const [removingId, setRemovingId] = useState(null);
  const [removeError, setRemoveError] = useState('');

  const handleRemove = async (book) => {
    setRemovingId(book.id);
    setRemoveError('');
    try {
      await onRemove(book.id);
    } catch (err) {
      setRemoveError(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  const shelves = chunkIntoShelves(isLoading ? [] : books);

  return (
    <div className="bookshelf-container">
      {isLoading && <p className="status-message">Loading your shelf…</p>}
      {error && <p className="form-error">{error}</p>}
      {removeError && <p className="form-error">{removeError}</p>}
      {!isLoading && !error && books.length === 0 && (
        <p className="status-message">Your shelf is empty. Search for books to add some.</p>
      )}

      <div className="bookshelf">
        {shelves.map((shelfBooks, shelfIndex) => (
          <div className="shelf-row" key={shelfIndex}>
            <div className="shelf-row-books">
              {shelfBooks.map((book) => (
                <BookSpine
                  key={book.id}
                  book={book}
                  isRemoving={removingId === book.id}
                  onRemove={handleRemove}
                />
              ))}
            </div>
            <div className="shelf-plank" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBooks;
