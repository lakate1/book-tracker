'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import BookSearch from '@/components/BookResults';
import MyBooks from '@/components/MyBooks';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { getMyBooks, addBookToList, removeBookFromList } from '@/components/api';

type Book = {
  id: string;
  title: string;
  authors: string[];
  image: string | null;
  description?: string | null;
};

const Page = () => {
  const { data: session, status } = useSession();
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'mylist'>('search');
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [booksError, setBooksError] = useState('');

  useEffect(() => {
    if (!session) return;

    let cancelled = false;
    setIsLoadingBooks(true);
    getMyBooks()
      .then((items) => {
        if (!cancelled) setMyBooks(items);
      })
      .catch((err) => {
        if (!cancelled) setBooksError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingBooks(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  const savedIds = new Set(myBooks.map((book) => book.id));

  const handleAddBook = async (book: Book) => {
    await addBookToList(book);
    setMyBooks((prev) => [book, ...prev]);
  };

  const handleRemoveBook = async (id: string) => {
    await removeBookFromList(id);
    setMyBooks((prev) => prev.filter((book) => book.id !== id));
  };

  if (status === 'loading') {
    return <p className="status-message">Loading...</p>;
  }

  if (!session) {
    return (
      <div className="auth-page">
        {showRegister ? <RegisterForm /> : <LoginForm />}
        <button
          className="auth-switch-button"
          onClick={() => setShowRegister((prev) => !prev)}
        >
          {showRegister ? 'Back to Login' : 'Create Account'}
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="app-header">
        <h1>Search a book to add it to your list</h1>
        <button className="logout-button" onClick={() => signOut()}>
          Log out
        </button>
      </header>

      <nav className="tab-bar">
        <button
          className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search
        </button>
        <button
          className={`tab-button ${activeTab === 'mylist' ? 'active' : ''}`}
          onClick={() => setActiveTab('mylist')}
        >
          My List{myBooks.length > 0 ? ` (${myBooks.length})` : ''}
        </button>
      </nav>

      {activeTab === 'search' ? (
        <BookSearch onAdd={handleAddBook} savedIds={savedIds} />
      ) : (
        <MyBooks
          books={myBooks}
          isLoading={isLoadingBooks}
          error={booksError}
          onRemove={handleRemoveBook}
        />
      )}
    </>
  );
};

export default Page;
