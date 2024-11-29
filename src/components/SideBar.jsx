'use client';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import { Trash } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const SideBar = () => {
  const { isLoggedIn, user, token } = useAuth(); // Ensure token is included in context
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  // Fetch user's pantry from the database on login
  useEffect(() => {
    if (isLoggedIn && user) {
      fetchPantry();
    }
  }, [isLoggedIn, user]);

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
      setIngredients(response.data.pantry || []);
    } catch (error) {
      console.error('Error fetching pantry:', error.message);
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
      const response = await axios.get('/api/autocomplete', { params: { query } });
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
      <div className="mt-6 mx-4 p-2 w-full">
        <h2 className="text-lg m-2">Add Ingredients</h2>
        {!isLoggedIn && (
          <p className="text-sm text-yellow-800 my-2">
            <Link href={'/login'} className='text-blue-700 underline'> Log in </Link> to save your pantry and sync it across devices.
          </p>
        )}
        <div className="flex justify-center relative">
          <input
            type="text"
            placeholder="Enter ingredients (e.g., chicken, tomato)..."
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full p-3 text-sm border border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* Autocomplete Suggestions */}
          {suggestions.length > 0 && (
            <ul className="absolute text-sm top-14 w-full bg-white border border-teal-600 rounded-lg shadow-md z-10">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id} // Ensure unique key
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-3 cursor-pointer hover:bg-teal-100"
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className='text-sm capitalize my-4'> you have {ingredients.length} pentry items.</p>
        {/* Ingredients List */}
        <ul className="mt-4">
          {ingredients.map((ingredient) => (
            <li
              key={ingredient.id} // Ensure unique key
              className="flex justify-between items-center border m-2 py-2 px-4 border-teal-800 rounded-xl hover:bg-teal-100"
            >
              <span>{ingredient.name}</span>
              <Trash
                width={20}
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
