
const searchBooks = async (query) => {
    const response = await fetch('/api/books?q=' + encodeURIComponent(query));
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to search books');
    }

    return data.items || [];
};

export { searchBooks };
