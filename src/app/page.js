'use client'
import RecipeCard from '@/components/RecipeCard';
import axios from 'axios';
import { Heart, SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Home = () => {
    const [recipes, setRecipes] = useState([])
    const [error, setError] = useState('');

    const fectRandomRecipes = async () => {
        try {
            const response = await axios.get('/api/random-recipes')
            setError('')
            setRecipes(response.data.recipes)
        } catch (error) {
            setError(error.message);
            console.error(error.message);
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

                        {/* {recipes.length ? (
                            recipes.map((recipe, i) => <RecipeCard key={recipe.id || i} recipe={recipe} />)
                        ) : (
                            <p className="col-span-3 text-center text-gray-500">No recipes found</p>
                        )} */}

                        {/* demo recipecard */}
                        <div
                            className="rounded-lg p-4 border border-teal-700 shadow-sm shadow-indigo-100 flex transition-transform transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-200"
                        >
                            {/* Image Section */}
                            <div className="w-1/3 overflow-hidden rounded-md">
                                <Image
                                    height={100}
                                    width={100}
                                    alt={'pic'}
                                    src={'/rep.jpg'}
                                    className="h-full w-full rounded-md object-cover transition-transform transform hover:scale-110"
                                />
                            </div>

                            {/* Content Section */}
                            <div className="w-2/3 pl-4 flex flex-col justify-between">
                                <div>
                                    <div className="font-semibold font-header text-zinc-700 transition-colors hover:text-teal-600">
                                        Chicken Butter
                                    </div>

                                    <p className='text-xs text-gray-800'>Missed Ingredients : <span className='font-numbers text-red-800'>2</span></p>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center gap-4 ">
                                        <button className="text-teal-600 hover:text-teal-800 transition-colors ">
                                            <Heart height={20} />
                                        </button>

                                        <Link href={`/recipes/`}>
                                            <SquareArrowOutUpRight height={20} className="text-teal-600 hover:text-teal-800 transition-colors" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

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
