'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import React from 'react'
import SearchBar from '@/components/SearchBar';
import MealTypeDropdown from '@/components/MealTypeDropdown';
import DietDropdown from '@/components/DietDropdown';
import CuisineDropdown from '@/components/CuisineDropdown';
import RecipeCard from '@/components/RecipeCard';

const GetAnyRecipe = () => {
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mealType, setMealType] = useState('');
    const [mealTypeOpen, setMealTypeOpen] = useState(false);
    const [selectedDiet, setSelectedDiet] = useState([]);
    const [dietOpen, setDietOpen] = useState(false);
    const [selectedCuisine, setSelectedCuisine] = useState([]);
    const [cuisineOpen, setCuisineOpen] = useState(false);
    const suggestionBoxRef = useRef(null);
    const dietRef = useRef(null);
    const cuisineRef = useRef(null);
    const mealRef = useRef(null);


    // Fetch autocomplete suggestions
    const fetchSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get('/api/autocomplete-recipes', {
                params: { query },
            });
            setLoading(false);
            setSuggestions(response.data);
        } catch (err) {
            console.error('Error fetching suggestions:', err.message);
            setError('Failed to fetch suggestions. Please try again later.');
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
                params: { recipe: searchQuery, mealType, diet: selectedDiet.join(','), cuisine: selectedCuisine.join(',') },
            });
            setRecipes(response.data.results);
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
        setSearchQuery(suggestion.title);
        setSuggestions([]);
        fetchRecipes();
    };

    // Close the dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                suggestionBoxRef.current &&
                !suggestionBoxRef.current.contains(event.target)
            ) {
                setSuggestions([]);
            }
            if (dietRef.current && !dietRef.current.contains(event.target)) {
                setDietOpen(false);
            }
            if (cuisineRef.current && !cuisineRef.current.contains(event.target)) {
                setCuisineOpen(false);
            }
            if (mealRef.current && !mealRef.current.contains(event.target)) {
                setMealTypeOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle selection for Meal Type (single)
    const handleMealTypeChange = (type) => {
        setMealType(type);
        setMealTypeOpen(false);
        fetchRecipes();
    };

    // Handle selection for Diet Definitions (multiple)
    const handleDietChange = (diet) => {
        setSelectedDiet((prev) => {
            if (prev.includes(diet)) {
                return prev.filter((d) => d !== diet);
            } else {
                return [...prev, diet];
            }
        });
        fetchRecipes();
    };

    // Handle selection for Cuisines (multiple)
    const handleCuisineChange = (cuisine) => {
        setSelectedCuisine((prev) => {
            if (prev.includes(cuisine)) {
                return prev.filter((c) => c !== cuisine);
            } else {
                return [...prev, cuisine];
            }
        });
        fetchRecipes();
    };



    return (
        <div className="container mx-auto p-4">
            {/* Search Bar */}
            <h1 className='text-3xl font-header mt-7 mb-10  text-teal-700 mx-3 text-center'>Discover, Cook, Enjoy... </h1>
            <SearchBar
                searchQuery={searchQuery}
                handleInputChange={handleInputChange}
                handleSearch={handleSearch}
                suggestions={suggestions}
                handleSuggestionClick={handleSuggestionClick}
                suggestionBoxRef={suggestionBoxRef}
            />

            <div className='flex items-center justify-center w-full'>
                {/* Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-2  max-w-screen-sm mt-5 ">

                    <MealTypeDropdown
                        mealType={mealType}
                        mealTypeOpen={mealTypeOpen}
                        setMealTypeOpen={setMealTypeOpen}
                        handleMealTypeChange={handleMealTypeChange}
                        mealRef={mealRef}
                    />
                    <DietDropdown
                        selectedDiet={selectedDiet}
                        dietOpen={dietOpen}
                        setDietOpen={setDietOpen}
                        handleDietChange={handleDietChange}
                        dietRef={dietRef}
                    />
                    <CuisineDropdown
                        selectedCuisine={selectedCuisine}
                        cuisineOpen={cuisineOpen}
                        setCuisineOpen={setCuisineOpen}
                        handleCuisineChange={handleCuisineChange}
                        cuisineRef={cuisineRef}
                    />
                </div>
            </div>

            {/* Recipe Results */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {loading ? (
                    <div className='animate-pulse h-60'></div>
                ) : recipes.length ? (
                    recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
                ) : (
                    <p className="col-span-3 text-center text-gray-500">No recipes found</p>
                )}
            </div>


            {error.message && (
                <div
                    role="alert"
                    aria-live="polite"
                    className={`fixed bottom-4 right-4 mb-4 mr-4 px-6 py-4 rounded shadow-lg transition-opacity duration-300 ${alert.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
                        }`}
                >
                    <span>{error.message}</span>
                </div>
            )}
        </div>
    );
}

export default GetAnyRecipe