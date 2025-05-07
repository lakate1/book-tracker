'use client';

import React from 'react';
import BookSearch from '../components/BookSearch';

interface Book {
    id: string;
    title: string;
    authors: string[];
    image: string;
}

const addBook = async (book: Book) => {
    console.log('book added', book);
    // Add the book to your state or DB here
};

const Page = () => {
    return (
        <header>
            <h1>Search a book to add it to your list</h1>
        <div className="book-search-container">
            <BookSearch addBook={addBook} />
        </div>
        </header>
    );
};

export default Page;