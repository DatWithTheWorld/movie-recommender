import { useState } from 'react';

function SearchBar({ onSearch }) {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');

  const handleSearch = () => {
    onSearch({ search, genre, year });
  };

  return (
    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
      <input
        type="text"
        className="p-2 border rounded dark:bg-dark-card dark:text-white"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <input
        type="text"
        className="p-2 border rounded dark:bg-dark-card dark:text-white"
        placeholder="Genre..."
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />
      <input
        type="number"
        className="p-2 border rounded dark:bg-dark-card dark:text-white"
        placeholder="Year..."
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;