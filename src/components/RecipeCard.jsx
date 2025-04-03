'use client';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import { Heart, SquareArrowOutUpRight } from 'lucide-react';
import { IngredientsPopup } from './IngredientsPopup';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const RecipeCard = ({ recipe }) => {
    const { isLoggedIn, favorites, addToFavorites, removeFromFavorites } = useAuth();
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupIngredients, setPopupIngredients] = useState([]);

    const isFavorite = favorites.some((fav) => fav.recipeId === recipe.id);

    const handleToggleFavorite = async () => {
        if (!isLoggedIn) {
            setAlert({ type: 'error', message: 'Please log in to save recipes to your favorites.' });
            return;
        }

        try {
            if (isFavorite) {
                await removeFromFavorites(recipe.id);
                setAlert({ type: 'success', message: `${recipe.title} removed from your favorites.` });
            } else {
                await addToFavorites(recipe);
                setAlert({ type: 'success', message: `${recipe.title} added to your favorites.` });
            }
        } catch (error) {
            console.log('Error toggling favorite:', error.message);
            setAlert({ type: 'error', message: 'An error occurred.' });
        }
    };

    useEffect(() => {
        if (error.message) {
            const timer = setTimeout(() => {
                setError({ type: '', message: '' });
            }, 3000); 
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <>
            <div key={recipe.id} className="rounded-lg sm:p-4 p-2 border border-teal-700 shadow-sm shadow-indigo-100 flex transition-transform transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-200">
                {/* Image Section */}
                <div className="w-1/3 overflow-hidden rounded-md">
                    <Image height={100} width={100} alt={recipe.title} src={recipe.image || '/rep.jpg'} className="h-full w-full rounded-md object-cover transition-transform transform hover:scale-110" />
                </div>

                {/* Content Section */}
                <div className="w-2/3 pl-4 flex flex-col justify-between">
                    <div>
                        <div className="font-semibold text-sm font-header text-zinc-700 transition-colors hover:text-teal-600">
                            {recipe.title}
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-4">
                            <button className={`text-teal-600 hover:text-teal-800 transition-colors ${isFavorite ? 'text-teal-700' : 'text-gray-800'}`} onClick={handleToggleFavorite}>
                                <Heart height={20} fill={isFavorite ? 'currentColor' : 'none'} />
                            </button>
                            <Link href={`/recipe-info/${recipe.id}`}>
                                <button>
                                    <SquareArrowOutUpRight height={20} className="text-teal-600 hover:text-teal-800 transition-colors" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {alert.message && (
                <div role="alert" aria-live="polite" className={`z-50 max-w-80 fixed bottom-4 right-4 mb-4 mr-4 px-6 py-4 shadow-lg bg-slate-50 duration-300 ${alert.type === 'success' ? 'bg-teal-100 border border-teal-400 text-teal-800' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                    <span>{alert.message}</span>
                </div>
            )}

            <IngredientsPopup isOpen={isPopupOpen} ingredients={popupIngredients} onClose={() => setIsPopupOpen(false)} />
        </>
    );
};

export default RecipeCard;
