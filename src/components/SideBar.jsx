'use client';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import { PlusSquare, Trash } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

const SideBar = () => {
  const { isLoggedIn, user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const suggestRef = useRef(null);

  // Fetch user's pantry from the database on login
  useEffect(() => {
    if (isLoggedIn && user) {
      fetchPantry();
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestRef.current && !suggestRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchPantry = async () => {
    const token = localStorage.getItem('token');  // Fallback to direct localStorage
    console.log("User token before making request:", token);
    if (!token) {
      throw new Error('Token is missing from localStorage');
    }
    try {
      const response = await axios.get('/api/pantry', {
        headers: {
          Authorization: `Bearer ${token}`, // Send token directly
        },
      });
      console.log(response.data.pantry);
      setIngredients(response.data.pantry || []);
    } catch (error) {
      console.error('Error fetching pantry in sidebar:', error.message);
    }
  };

  const updatePantryInDB = async (updatedPantry) => {
    if (!isLoggedIn) return; // Prevent updates if the user is not logged in

    try {
      await axios.post(
        '/api/pantry',
        { pantry: updatedPantry },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token in header
          },
        }
      );
    } catch (error) {
      console.error('Error updating pantry:', error.message);
    }
  };

  // Fetch suggestions from API
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get('/api/autocomplete-ingredients', { params: { query } });
      setSuggestions(
        response.data.map((item, index) => ({
          ...item,
          id: item.id || `${item.name}-${index}`, // Ensure unique IDs
        }))
      );
    } catch (error) {
      console.error('Error fetching suggestions:', error.message);
    }
  };

  // Handle input change and fetch suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchSuggestions(value);
  };

  // Add ingredient to the list
  const handleSuggestionClick = (suggestion) => {
    if (!ingredients.find((ingredient) => ingredient.id === suggestion.id)) {
      const updatedIngredients = [...ingredients, suggestion];
      setIngredients(updatedIngredients);

      // Update pantry in the database
      if (isLoggedIn) {
        updatePantryInDB(updatedIngredients);
      }
    }
    setSearchQuery('');
    setSuggestions([]);
  };

  // Remove ingredient from the list
  const handleRemoveIngredient = (id) => {
    const updatedIngredients = ingredients.filter((ingredient) => ingredient.id !== id);
    setIngredients(updatedIngredients);

    // Update pantry in the database
    if (isLoggedIn) {
      updatePantryInDB(updatedIngredients);
    }
  };

  return (
    <div>
      <div className="mt-4 mx-4 p-2 flex flex-col items-center">

        <h2 className="text-md m-2 font-semibold font-header text-teal-700">Add Ingredients</h2>
        {!isLoggedIn && (
          <p className="text-sm text-yellow-800 my-2">
            <Link href={'/login'} className='text-blue-700 underline font-header'> Log in</Link>  to save your pantry and sync it across devices.
          </p>
        )}

        {/* input part */}
        <div className="flex justify-center relative w-full">
          <input
            type="text"
            placeholder="Enter ingredients (e.g., chicken, tomato)..."
            value={searchQuery}
            onChange={handleInputChange}
            className="w-80 p-3 text-xs border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />


          {/* Autocomplete Suggestions */}
          {suggestions.length > 0 && (
            <ul className="absolute text-sm top-14 w-full bg-white border border-teal-600 rounded-lg shadow-md z-10" ref={suggestRef}>
              {suggestions.map((suggestion, i) => (
                <li
                  key={suggestion.id || i} // Ensure unique key
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-3 cursor-pointer hover:bg-teal-100 relative pr-12"
                >
                  {suggestion.name}
                  <button
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-800"
                  >
                    <PlusSquare />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className='text-sm capitalize mt-4 font-body'> you have <span className='text-teal-700 font-numbers'>{ingredients.length}</span> pentry items.</p>
        {/* Ingredients List */}
        <ul className="m-4 flex flex-wrap">
          {ingredients.map((ingredient) => (
            <li
              key={ingredient.id} // Ensure unique key
              className="w-auto flex justify-between items-center border  mr-2 mb-2 py-1 px-2 border-teal-800 hover:bg-teal-50"
            >
              <span className='text-sm mr-2'>{ingredient.name}</span>
              <Trash
                width={15}
                className="text-red-800 cursor-pointer"
                onClick={() => handleRemoveIngredient(ingredient.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
