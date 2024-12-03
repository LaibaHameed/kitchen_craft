'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

const RecipeInfo = ({ params }) => {
    const router = useRouter();
    const [recipeDetails, setRecipeDetails] = useState(null);
    const [error, setError] = useState(null);
    const [instructions, setInstructions] = useState([]);

    const { id } = React.use(params);

    useEffect(() => {
        if (!id) return;  

        const fetchRecipeDetails = async () => {
            try {
                const response = await axios.get('/api/recipe-info', {
                    params: { recipeId: id }, 
                });
                setRecipeDetails(response.data);
            } catch (error) {
                setError('Failed to fetch recipe details. Please try again later.');
            }
        };

        fetchRecipeDetails();
    }, [id]);


    useEffect(() => {
        // Process instructions to extract individual steps from the HTML string
        if (recipeDetails?.instructions) {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(recipeDetails.instructions, 'text/html');
            const paragraphs = htmlDoc.querySelectorAll('p');
            const steps = Array.from(paragraphs).map((p) => p.textContent.trim()).filter(Boolean);
            setInstructions(steps);
        }
        console.log("recipeDetails: ", recipeDetails);
        console.log("instructions: ", instructions);
    }, [recipeDetails]);

    const extractNutrition = (summary) => {
        // Regular expression to extract nutritional information from the summary string
        const nutrition = {};
        const regex = /(\d+)\s*(g|calories)\s*([^<]*)/g;
        let match;

        while ((match = regex.exec(summary)) !== null) {
            const value = match[1];
            const unit = match[2];
            const nutrient = match[3].trim();
            if (unit === 'g') {
                nutrition[nutrient] = `${value}g`;
            } else if (unit === 'calories') {
                nutrition.calories = `${value} calories`;
            }
        }

        return nutrition;
    };

    const nutrition = extractNutrition(recipeDetails?.summary);

    const onClose = () => {
        router.back(); 
    };

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!recipeDetails) {
        return <div className='w-full mt-60 flex items-center justify-center'>
            <p className='font-header'>Loading...</p>
        </div>;
    }

    return (
        <div className="p-6 sm:p-12">
            <div className="bg-white">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute sm:top-24 sm:left-4 sm:right-0 top-16 right-4  text-gray-700 hover:text-gray-900 text-2xl"
                >
                    &times;
                </button>
                {/* Title */}
                <h2 className="text-xl font-bold mb-4 font-header">{recipeDetails.title}</h2>
                {/* Image */}
                <Image
                    src={recipeDetails.image || '/rep.jpg'}
                    alt={recipeDetails.title}
                    height={300}
                    width={300}
                    className="rounded-md mb-4"
                />
                {/* Additional Info */}
                <p className="text-sm text-gray-900 mb-2">
                    <strong className='font-header'>Cooking Time:</strong> {recipeDetails.readyInMinutes} mins
                </p>
                {/* Ingredients */}
                <p className="text-sm text-gray-900 mb-4">
                    <strong className='font-header'>Ingredients:</strong>
                </p>
                <ul className="list-disc pl-6 text-sm text-gray-600">
                    {recipeDetails.extendedIngredients?.map((ingredient, idx) => (
                        <li key={idx}>{ingredient.original}</li>
                    ))}
                </ul>
                {/* Instructions */}
                <p className="text-sm text-gray-900 mt-4">
                    <strong className='font-header'>Instructions:</strong>
                </p>
                <ol className="list-decimal pl-6 text-sm text-gray-900 mt-2 font-sans">
                    {instructions.length > 0 ? instructions.map((step, index) => (
                        <li key={index} className="mb-2">{step}</li>
                    )) : (
                        <p className='font-body'>
                            no instructions found, 
                            <Link
                                href={recipeDetails.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:text-teal-800 underline font-header"
                            >
                                View full recipe
                            </Link>
                        </p>
                    )}
                </ol>

                {/*  Nutrition Information */}
                <h2 className="text-lg font-bold text-gray-900 font-header">Nutrition Information</h2>
                <div className="text-sm text-gray-900 mt-2">
                    <p><strong>Calories:</strong> {nutrition.calories || 'N/A'}</p>
                    <p><strong>Protein:</strong> {nutrition['protein'] || 'N/A'}</p>
                    <p><strong>Fat:</strong> {nutrition['fat'] || 'N/A'}</p>
                    <p><strong>Price per Serving:</strong> ${recipeDetails.pricePerServing.toFixed(2)}</p>
                </div>


                {/* Link to Full Recipe */}
                <p className="text-sm text-gray-700 mt-4">
                    <Link
                        href={recipeDetails.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-800 underline font-header"
                    >
                        View full recipe
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RecipeInfo;
