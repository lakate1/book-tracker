'use client';

import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import BookSearch from '../components/BookResults';
import LoginForm from '@/components/LoginForm';

type Book = {
    id: string;
    title: string;
    authors: string[];
    image: string;
  };

const addBook = async (book: Book) => {
  console.log('book added', book);
  // Add book to DB/state here
};

const Page = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <LoginForm />;
  }

  return (
    <header>
      <h1>Search a book to add it to your list</h1>
      <BookSearch addBook={addBook} />
    </header>
  );
};

export default Page;
