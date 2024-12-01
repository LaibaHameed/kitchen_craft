'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import RecipeCard from '@/components/RecipeCard';

const Favorites = () => {
    const { isLoggedIn, token } = useAuth();
    const [favorites, setFavorites] = useState([]);  
    const [recipeDetails, setRecipeDetails] = useState([]); 
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Redirect to login if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn]);

    // Fetch favorite recipe IDs from the backend
    useEffect(() => {
        if (isLoggedIn) {
            const fetchFavorites = async () => {
                try {
                    setLoading(true)
                    const response = await axios.get('/api/favorites', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(response.data.favorites);
                    setLoading(false)
                    setFavorites(response.data.favorites); 
                } catch (error) {
                    console.error('Error fetching favorite recipes:', error.message);
                }finally{
                    setLoading(false)
                }
            };
            fetchFavorites();
        }
    }, [isLoggedIn, token]);

    // Fetch recipe details using the recipe IDs
    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                setLoading(true)
                const recipesData = await axios.post('/api/recipe-info', {
                    recipeIds: favorites 
                });

                setLoading(false)
                setRecipeDetails(recipesData.data.recipes); 
            } catch (error) {
                console.error('Error fetching recipe details:', error.message);
            }finally{
                setLoading(false)
            }
        };

        if (favorites.length > 0) {
            fetchRecipeDetails();
        }
    }, [favorites]);

    return (
        <div className="md:p-8 p-4">
            <h1 className="text-2xl font-semibold mb-8 font-header">Your Favorite Recipes</h1>

            {/* Recipe cards container with responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                    loading ? (
                        <div className='animate-pulse h-60'></div>
                    ) : (
                        recipeDetails.length > 0 ? (
                            recipeDetails.map((recipe) => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))
                        ) : (
                            <p className="text-center text-lg text-gray-500">No favorite recipes found.</p>
                        )
                    )
                }
            </div>
        </div>
    );
};

export default Favorites;
