import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();
  const books = await db
    .collection('books')
    .find({ userEmail: session.user.email })
    .sort({ addedAt: -1 })
    .toArray();

  return NextResponse.json({
    items: books.map((book) => ({
      id: book.bookId,
      title: book.title,
      authors: book.authors,
      image: book.image,
      description: book.description,
    })),
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, title, authors, image, description } = await request.json();

  if (!id || !title) {
    return NextResponse.json({ error: 'Book id and title are required' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const booksCollection = db.collection('books');

  const existing = await booksCollection.findOne({ userEmail: session.user.email, bookId: id });
  if (existing) {
    return NextResponse.json({ error: 'Book is already in your list' }, { status: 409 });
  }

  await booksCollection.insertOne({
    userEmail: session.user.email,
    bookId: id,
    title,
    authors: authors || [],
    image: image || null,
    description: description || null,
    addedAt: new Date(),
  });

  return NextResponse.json({ message: 'Book added' }, { status: 201 });
}
