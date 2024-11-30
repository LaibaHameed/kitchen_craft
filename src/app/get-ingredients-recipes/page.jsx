'use client'
import React, { useEffect, useState, useRef } from 'react';
import SideBar from '@/components/SideBar';
import MealTypeDropdown from '@/components/MealTypeDropdown';
import DietDropdown from '@/components/DietDropdown';
import CuisineDropdown from '@/components/CuisineDropdown';
import axios from 'axios';
import RecipeCard from '@/components/RecipeCard';
import Link from 'next/link';
import { ArrowLeft, ArrowLeftSquare } from 'lucide-react';

const GetIngredientsRecipe = () => {
  const [mealType, setMealType] = useState('');
  const [mealTypeOpen, setMealTypeOpen] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState([]);
  const [dietOpen, setDietOpen] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [cuisineOpen, setCuisineOpen] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]); // Pantry items
  const [sidebarVisible, setSidebarVisible] = useState(true); // state to manage sidebar visibility

  const dietRef = useRef(null);
  const cuisineRef = useRef(null);
  const mealRef = useRef(null);

  // Fetch pantry items from the Sidebar (or backend)
  const fetchPantry = async () => {
    try {
      const response = await axios.get('/api/pantry', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setIngredients(response.data.pantry || []);
    } catch (error) {
      console.error('Error fetching pantry items:', error.message);
    }
  };

  // Fetch recipes based on pantry and selected filters
  const fetchRecipes = async () => {
    try {
      const ingredientNames = ingredients.map((ingredient) => ingredient.name).join(',');

      const response = await axios.get('/api/ingredients-recipes', {
        params: {
          ingredients: ingredientNames,
          mealType,
          diet: selectedDiet.join(','),
          cuisine: selectedCuisine.join(','),
        },
      });
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
    }
  };

  // Fetch recipes whenever ingredients or filters change
  useEffect(() => {
    if (ingredients.length > 0) {
      // fetchRecipes();
    }
  }, [ingredients, mealType, selectedDiet, selectedCuisine]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    // Fetch pantry items on page load
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

  const handleMealTypeChange = (type) => {
    setMealType(type);
    setMealTypeOpen(false);
  };

  const handleDietChange = (diet) => {
    setSelectedDiet((prev) => {
      if (prev.includes(diet)) {
        return prev.filter((d) => d !== diet);
      } else {
        return [...prev, diet];
      }
    });
  };

  const handleCuisineChange = (cuisine) => {
    setSelectedCuisine((prev) => {
      if (prev.includes(cuisine)) {
        return prev.filter((c) => c !== cuisine);
      } else {
        return [...prev, cuisine];
      }
    });
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    // <div className='flex flex-col items-center'>

    <div className="flex flex-col w-full items-center mt-4 mx-2">

      {/* <Link href={'/'} className='border border-teal-700 p-1'>
        <ArrowLeft className='text-teal-800'/>
      </Link> */}

      <h1 className='text-3xl font-header mt-7 text-teal-700 mx-3'> From Pantry to Plate: Recipes Made Simple </h1>

      <SideBar />

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-2  max-w-screen-sm">
        <MealTypeDropdown
          mealType={mealType}
          mealTypeOpen={mealTypeOpen}
          setMealTypeOpen={setMealTypeOpen}
          handleMealTypeChange={setMealType}
          mealRef={mealRef}
        />
        <DietDropdown
          selectedDiet={selectedDiet}
          dietOpen={dietOpen}
          setDietOpen={setDietOpen}
          handleDietChange={(diet) =>
            setSelectedDiet((prev) =>
              prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
            )
          }
          dietRef={dietRef}
        />
        <CuisineDropdown
          selectedCuisine={selectedCuisine}
          cuisineOpen={cuisineOpen}
          setCuisineOpen={setCuisineOpen}
          handleCuisineChange={(cuisine) =>
            setSelectedCuisine((prev) =>
              prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
            )
          }
          cuisineRef={cuisineRef}
        />
      </div>

      {/* Recipe Cards */}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">No recipes found</p>
        )}
      </div>


    </div>
    // </div>
  );
};

export default GetIngredientsRecipe;
