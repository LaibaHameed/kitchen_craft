'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '@/components/RecipeCard';

const Favorites = () => {
    const {favorites } = useAuth();

    return (
        <div className="md:p-8 p-4">
            <h1 className="text-2xl font-semibold mb-8 font-header">Your Favorite Recipes</h1>

            {/* Recipe cards container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                { favorites.length > 0 ? (
                    favorites.map((recipe,i) => (
                        <RecipeCard
                            key={recipe.recipeId || i}
                            recipe={{
                                id: recipe.recipeId,
                                title: recipe.title,
                                image: recipe.image,
                            }}
                        />
                    ))
                ) : <p className="text-center text-lg text-gray-500">No favorite recipes found.</p>
                }
            </div>
        </div>
    );
};

export default Favorites;
