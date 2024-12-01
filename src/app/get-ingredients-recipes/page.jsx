'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import MealTypeDropdown from '@/components/MealTypeDropdown';
import DietDropdown from '@/components/DietDropdown';
import CuisineDropdown from '@/components/CuisineDropdown';
import axios from 'axios';
import RecipeCard from '@/components/RecipeCard';
import Pantry from '@/components/Pantry';

const GetIngredientsRecipe = () => {
  const [mealType, setMealType] = useState('');
  const [mealTypeOpen, setMealTypeOpen] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState([]);
  const [dietOpen, setDietOpen] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [cuisineOpen, setCuisineOpen] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [repLoading, setRepLoading] = useState(false);
  const { isLoggedIn, user, token } = useAuth();

  const dietRef = useRef(null);
  const cuisineRef = useRef(null);
  const mealRef = useRef(null);

  // Fetch user's pantry from the database on login
  const fetchPantry = async () => {
    // If no token, user is not logged in, skip fetching pantry
    if (!token) {
      console.log("No token found. User is not logged in. Using local pantry only.");
      return;
    }

    try {
      setLoading(true)
      const response = await axios.get('/api/pantry', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.pantry);
      setLoading(false)
      setIngredients(response.data.pantry || []);
    } catch (error) {
      console.error('Error fetching pantry in sidebar:', error.message);
    } finally {
      setLoading(false)
    }
  };


  // Fetch recipes based on pantry and selected filters
  const fetchRecipes = async () => {
    try {
      setRepLoading(true)
      const ingredientNames = ingredients.map((ingredient) => ingredient.name).join(',');
      const response = await axios.get('/api/ingredients-recipes', {
        params: {
          ingredients: ingredientNames,
          mealType,
          diet: selectedDiet.join(','),
          cuisine: selectedCuisine.join(','),
        },
      });
      setRepLoading(false);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
    } finally {
      setRepLoading(false)
    }
  };

  // Fetch recipes whenever ingredients or filters change
  useEffect(() => {
    if (ingredients.length > 0) {
      fetchRecipes();
    }
  }, [ingredients, mealType, selectedDiet, selectedCuisine]);

  // Fetch pantry items on page load and handle dropdown clicks
  useEffect(() => {
    fetchPantry();
    const handleClickOutside = (event) => {
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
    <div className="flex flex-col w-full items-center mt-4 mx-2">
      <h1 className='text-3xl font-header mt-7 text-teal-700 mx-3'> From Pantry to Plate: Recipes Made Simple </h1>

      {/* Pass props to Pantry */}
      <Pantry
        ingredients={ingredients}
        setIngredients={setIngredients}
        fetchPantry={fetchPantry}
      />

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-2 max-w-screen-sm">
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

      {/* Recipe Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
        {
          loading ? (
            <div className="animate-pulse col-span-3 h-60 text-center">
              <p>Loading recipes...</p>
            </div>
          ) : (
            recipes.length > 0 ? (
              recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">No recipes found</p>
            )
          )
        }
        { }
      </div>
    </div>
  );
};

export default GetIngredientsRecipe;
