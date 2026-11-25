
const searchBooks = async (query) => {
    const response = await fetch('/api/books?q=' + encodeURIComponent(query));
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to search books');
    }

    return data.items || [];
};

const getMyBooks = async () => {
    const response = await fetch('/api/mybooks');
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to load your list');
    }

    return data.items || [];
};

const addBookToList = async (book) => {
    const response = await fetch('/api/mybooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to add book');
    }

    return data;
};

const removeBookFromList = async (id) => {
    const response = await fetch('/api/mybooks/' + encodeURIComponent(id), {
        method: 'DELETE',
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to remove book');
    }

    return data;
};

export { searchBooks, getMyBooks, addBookToList, removeBookFromList };
