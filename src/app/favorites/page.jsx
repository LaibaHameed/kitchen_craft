'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import RecipeCard from '@/components/RecipeCard';

const Favorites = () => {
    const { isLoggedIn, token } = useAuth();
    const [favorites, setFavorites] = useState([]); // Stores the favorite recipes
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Redirect to login if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn]);

    // Fetch favorite recipes from the backend
    useEffect(() => {
        if (isLoggedIn) {
            const fetchFavorites = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get('/api/favorites', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setFavorites(response.data.favorites); // Directly use the favorite recipes
                } catch (error) {
                    console.error('Error fetching favorite recipes:', error.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchFavorites();
        }
    }, [isLoggedIn, token]);

    return (
        <div className="md:p-8 p-4">
            <h1 className="text-2xl font-semibold mb-8 font-header">Your Favorite Recipes</h1>

            {/* Recipe cards container with responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    [1,2,3,4,5,6,7,8,9,10].map((i)=><div key={i} className="animate-pulse h-32 bg-slate-200"></div>)
                ) : favorites.length > 0 ? (
                    favorites.map((recipe) => (
                        <RecipeCard
                            key={recipe.recipeId}
                            recipe={{
                                id: recipe.recipeId,
                                title: recipe.title,
                                image: recipe.image,
                            }}
                        />
                    ))
                ) : (
                    <p className="text-center text-lg text-gray-500">No favorite recipes found.</p>
                )}
            </div>
        </div>
    );
};

export default Favorites;
