
const searchBooks = async (query) => {
    try {
        const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=' + query);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.log("error finding books!");
        return [];
    }
};

export { searchBooks };
