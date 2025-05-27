'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import BookSearch from '../components/BookResults';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

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
  const [showRegister, setShowRegister] = useState(false); // ✅ this was missing

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <>
        {showRegister ? <RegisterForm /> : <LoginForm />}
        <button onClick={() => setShowRegister((prev) => !prev)}>
          {showRegister ? 'Back to Login' : 'Create Account'}
        </button>
      </>
    );
  }

  return (
    <header>
      <h1>Search a book to add it to your list</h1>
      <BookSearch addBook={addBook} />
    </header>
  );
};

export default Page;
