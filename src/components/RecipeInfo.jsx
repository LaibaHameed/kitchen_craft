'use client';

import Image from 'next/image';

const RecipePopup = ({ recipeDetails, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 shadow-xl relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl"
                >
                    &times;
                </button>
                {/* Title */}
                <h2 className="text-xl font-bold mb-4">{recipeDetails.title}</h2>
                {/* Image */}
                <Image
                    src={recipeDetails.image || '/rep.jpg'}
                    alt={recipeDetails.title}
                    height={300}
                    width={300}
                    className="rounded-md mb-4"
                />
                {/* Additional Info */}
                <p className="text-sm text-gray-700 mb-2">
                    <strong>Preparation Time:</strong> {recipeDetails.preparationMinutes} mins
                </p>
                <p className="text-sm text-gray-700 mb-2">
                    <strong>Cooking Time:</strong> {recipeDetails.cookingMinutes} mins
                </p>
                {/* Ingredients */}
                <p className="text-sm text-gray-700 mb-4">
                    <strong>Ingredients:</strong>
                </p>
                <ul className="list-disc pl-6 text-sm text-gray-600">
                    {recipeDetails.extendedIngredients?.map((ingredient, idx) => (
                        <li key={idx}>{ingredient.original}</li>
                    ))}
                </ul>
                {/* Instructions */}
                <p className="text-sm text-gray-700 mt-4">
                    <strong>Instructions:</strong> {recipeDetails.instructions || 'Not Available'}
                </p>
                {/* Link to Full Recipe */}
                <p className="text-sm text-gray-700 mt-4">
                    <a
                        href={recipeDetails.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-800 underline"
                    >
                        View full recipe
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RecipePopup;
