'use client';

import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, handleInputChange, handleSearch, suggestions, handleSuggestionClick, suggestionBoxRef }) => {
    return (
        <div className="flex justify-center relative w-full">
            <form onSubmit={handleSearch} className="relative">
                {/* Search Input */}
                <div className="relative sm:min-w-96 min-w-72">
                    <input
                        type="text"
                        placeholder="Search Recipes (e.g., pasta, biryani)..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        className="w-full p-3 text-xs pr-12 border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-800"
                    >
                        <Search />
                    </button>
                </div>

                {/* Autocomplete Suggestions */}
                {suggestions.length > 0 && (
                    <ul
                        ref={suggestionBoxRef}
                        className="absolute top-14 w-1/2 bg-white border border-teal-600 rounded-lg shadow-md z-10"
                    >
                        {suggestions.map((suggestion, i) => (
                            <li
                                key={suggestion.id || i}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="p-3 cursor-pointer hover:bg-teal-100"
                            >
                                {suggestion.title}
                            </li>
                        ))}
                    </ul>
                )}
            </form>
        </div>
    );
};

export default SearchBar;
