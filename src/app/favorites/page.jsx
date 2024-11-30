'use client'
import { Heart, SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const Favorites = () => {
    const { isLoggedIn } = useAuth()
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn])
    return (
        <div className="md:p-8 p-4">
            <h1 className="text-2xl font-semibold mb-8 font-header">Your Favorite Recipes</h1>

            {/* Recipe cards container with responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    );
};

export default Favorites;
