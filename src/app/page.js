'use client';

import { useState } from 'react';
import { Heart, SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import SideBar from '@/components/SideBar';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch autocomplete suggestions
    const fetchSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get('/api/autocomplete', {
                params: { query },
            });
            setSuggestions(response.data);
        } catch (err) {
            console.error('Error fetching suggestions:', err.message);
        }
    };

    // Fetch recipes
    const fetchRecipes = async () => {
        if (!searchQuery) {
            setError('Please enter some ingredients to search.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/api/recipes', {
                params: { ingredients: searchQuery },
            });
            setRecipes(response.data);
        } catch (err) {
            setError('Failed to fetch recipes. Please try again later.');
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle search form submit
    const handleSearch = (e) => {
        e.preventDefault();
        setSuggestions([]);
        fetchRecipes();
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        fetchSuggestions(value);
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.name); // Use the clicked suggestion
        setSuggestions([]); // Clear suggestions after selection
    };

    return (
        <>
        <div className='w-full flex m-0 p-0'>
        <SideBar className='w-4/8' />
        <div className="w-4/8 p-6 space-y-6">
            {/* Search Bar */}
            <div className="flex justify-center relative w-full">
                <form onSubmit={handleSearch} className="w-1/2">
                    <input
                        type="text"
                        placeholder="Enter ingredients (e.g., chicken, tomato)..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                        type="submit"
                        className="mt-4 w-full p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-800"
                    >
                        Search Recipes
                    </button>
                </form>

                {/* Autocomplete Suggestions */}
                {suggestions.length > 0 && (
                    <ul className="absolute top-14 w-1/2 bg-white border border-teal-600 rounded-lg shadow-md z-10">
                        {suggestions.map((suggestion,i) => (
                            <li
                                key={suggestion.id || i} // Add a unique key here
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="p-3 cursor-pointer hover:bg-teal-100"
                            >
                                {suggestion.name}
                            </li>
                        ))}
                    </ul>

                )}
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Recipe Results */}
            <div className="md:p-8 p-4">
                <h1 className="text-2xl font-semibold mb-8">Recipes</h1>

                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recipes.length > 0 ? (
                            recipes.map((recipe, i) => (
                                <div
                                    key={i} // Add a unique key here
                                    className="block rounded-lg p-4 shadow-sm shadow-indigo-100"
                                >
                                    <Image
                                        height={100}
                                        width={100}
                                        alt={recipe.title}
                                        src={recipe.image || '/rep.jpg'}
                                        className="h-56 w-full rounded-md object-cover"
                                    />
                                    <div className="mt-2">
                                        <dl>
                                            <div>
                                                <dt className="sr-only">Name</dt>
                                                <dd className="font-semibold">{recipe.title}</dd>
                                            </div>
                                        </dl>
                                        <div className="mt-6 flex justify-between items-center gap-4 w-full">
                                            <button className="text-teal-600 hover:text-teal-800">
                                                <Heart />
                                            </button>
                                            <Link
                                                href={`/recipes/${recipe.id}`}
                                                className="text-teal-600 hover:text-teal-800"
                                            >
                                                <SquareArrowOutUpRight />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600">
                                No recipes found. Try a different search.
                            </p>
                        )}
                    </div>

                )}
            </div>
        </div>
        </div>
        </>
    );
};

export default Home;
