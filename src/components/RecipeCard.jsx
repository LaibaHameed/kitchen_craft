'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, SquareArrowOutUpRight } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
    return (
        <div
            key={recipe.id}
            className="rounded-lg p-4 border-1 border-teal-500 shadow-sm shadow-indigo-100 flex transition-transform transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-200"
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
                <dl>
                    <div>
                        <dt className="sr-only">Name</dt>
                        <dd className="font-semibold text-zinc-700 transition-colors hover:text-teal-600">
                            {recipe.title}
                        </dd>
                    </div>
                </dl>
                <div>
                    <p className='text-xs text-gray-800'>Missed Ingredients : {recipe.missedIngredientCount}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-4">
                        <button className="text-teal-600 hover:text-teal-800 transition-colors">
                            <Heart />
                        </button>

                        <Link href={`/recipes/${recipe.id}`}>
                            <SquareArrowOutUpRight className="text-teal-600 hover:text-teal-800 transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
