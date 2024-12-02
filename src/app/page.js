'use client'

import RecipeCard from '@/components/RecipeCard';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Home = () => {
    const [recipes, setRecipes] = useState([])
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

    const fectRandomRecipes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/random-recipes')
            setError('')
            setRecipes(response.data.recipes)
            setLoading(false)
        } catch (error) {
            setError(error.message);
            console.error(error.message);
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        // fectRandomRecipes();
    }, [])

    return (
        <>
            <div>
                <div className='flex items-center justify-center sm:flex-row flex-col my-5'>
                    <Link href={'/get-recipes'} className='py-2 px-3 sm:text-sm border-2 border-teal-600 bg-teal-600 text-gray-100 md:m-4 m-1 hover:bg-transparent hover:text-teal-700 hover:font-semibold' >Get Any Recipes</Link>
                    <Link href={'/get-ingredients-recipes'} className='py-2 px-3 sm:text-sm border-2 border-teal-600 bg-teal-600 text-gray-100 md:m-4 m-1 hover:bg-transparent hover:text-teal-700 hover:font-semibold'>Get Recipe Based Ingredients</Link>
                </div>

                <div className='lg:mx-20 mx-5'>

                    <h1 className='text-2xl font-header'> Recipes </h1>

                    {/* Recipe Results */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">

                        {loading ? (
                            [1,2,3,4,5,6,7,8,9,10].map((i)=><div key={i} className="animate-pulse h-32 bg-slate-200"></div>)
                        ) : (
                            recipes.length ? (
                                recipes.map((recipe, i) => <RecipeCard key={recipe.id || i} recipe={recipe} />)
                            ) : (
                                <p className="col-span-3 text-center text-gray-500">No recipes found</p>
                            )
                        )}
                    </div>
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
        </>
    );
};

export default Home;
