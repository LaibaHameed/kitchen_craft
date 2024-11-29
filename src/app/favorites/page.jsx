import { Heart, SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Favorites = () => {
    return (
        <div className="md:p-8 p-4">
            <h1 className="text-2xl font-semibold mb-8">Your Favorite Recipes</h1>

            {/* Recipe cards container with responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Repeat this block for each recipe */}
                <div className="block rounded-lg p-4 shadow-sm shadow-indigo-100 ">
                    <Image
                        height={100}
                        width={100}
                        alt="Recipe"
                        src="/rep.jpg"
                        className="h-56 w-full rounded-md object-cover"
                    />

                    <div className="mt-2">
                        {/* Action buttons */}
                        <div className="mt-6 flex justify-between items-center gap-4 w-full">
                            <dl>
                                <div>
                                    <dt className="sr-only">Name</dt>
                                    <dd className="font-semibold">Baked Corn Pudding</dd>
                                </div>
                            </dl>
                            <div className='flex items-center gap-4'>
                                <button className="text-teal-600 hover:text-teal-800">
                                    <Heart />
                                </button>

                                {/* Link for recipe details, separate from the main link */}
                                <Link href="/recpie-page">
                                    <SquareArrowOutUpRight className="text-teal-600 hover:text-teal-800" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Add more recipe cards here following the same structure */}
            </div>
        </div>
    );
};

export default Favorites;
