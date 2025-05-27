'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();

      if (!text) {
        setMessage('Empty response from server');
        return;
      }

      const data = JSON.parse(text);

      if (res.ok) {
        setMessage('User created! Redirecting to login...');
        setTimeout(() => router.push('/'), 1500);
      } else {
        setMessage(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Register error:', err);
      setMessage('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
  );
}