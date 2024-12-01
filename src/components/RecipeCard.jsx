'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, SquareArrowOutUpRight } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

const RecipeCard = ({ recipe }) => {
    const { isLoggedIn, token } = useAuth()
    const [isFavorite, setIsFavorite] = useState(false);
    const [alert, setAlert] = useState({ type: '', message: '' });

    const handleAddToFavorites = async () => {
        if (!isLoggedIn) {
            setAlert({ type: 'error', message: 'Please log in to save recipes to your favorites.' });
            return;
        }

        try {
            await axios.post(
                '/api/favorites',
                { recipeId: recipe.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAlert({ type: 'success', message: `${recipe.title} recipe to your favorites.` });
            setIsFavorite(true);
        } catch (error) {
            console.log('Error adding recipe to favorites:', error.message);
            if (error.status == 400) {
                setAlert({ type: 'success', message: 'Recipe is already in your favorites' });
            } else {
                setAlert({ type: 'error', message: error.message });
            }
        }
    };

    useEffect(() => {
        if (alert.message) {
            const timer = setTimeout(() => {
                setAlert({ type: '', message: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    return (
        <>
            <div
                key={recipe.id}
                className="rounded-lg sm:p-4 p-2 border border-teal-700 shadow-sm shadow-indigo-100 flex transition-transform transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-200"
            >
                {/* Image Section */}
                <div className="w-1/3 overflow-hidden rounded-md">
                    <Image
                        height={100}
                        width={100}
                        alt={recipe.title}
                        src={recipe.image || '/rep.jpg'}
                        className="h-full w-full rounded-md object-cover transition-transform transform hover:scale-110"
                    />
                </div>

                {/* Content Section */}
                <div className="w-2/3 pl-4 flex flex-col justify-between">
                    <div>
                        <div className="font-semibold text-sm font-header text-zinc-700 transition-colors hover:text-teal-600">
                            {recipe.title}
                        </div>
                        {recipe.missedIngredientCount ? (
                            <p className='text-xs text-gray-800'>Missed Ingredients : <span className='font-numbers text-red-800'>{recipe.missedIngredientCount}</span></p>
                        ) : (<></>)}

                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-4 ">
                            <button
                                className={`text-teal-600 hover:text-teal-800 transition-colors ${isFavorite ? 'text-red-600' : ''
                                    }`}
                                onClick={handleAddToFavorites}
                            >
                                <Heart height={20} fill={isFavorite ? 'currentColor' : 'none'} />
                            </button>

                            <Link href={`/recipes/${recipe.id}`}>
                                <SquareArrowOutUpRight height={20} className="text-teal-600 hover:text-teal-800 transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {alert.message && (
                <div
                    role="alert"
                    aria-live="polite"
                    className={`z-50 max-w-80 fixed bottom-4 right-4 mb-4 mr-4 px-6 py-4 shadow-lg bg-slate-50 duration-300 ${alert.type === 'success' ? 'bg-teal-100 border border-teal-400 text-teal-800' : 'bg-red-100 border border-red-400 text-red-700'
                        }`}
                >
                    <span>{alert.message}</span>
                </div>
            )}
        </>
    );
};

export default RecipeCard;
