export const IngredientsPopup = ({ isOpen, ingredients, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg w-80 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-teal-700">Ingredients</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                <ul className="space-y-2">
                    {ingredients.map((ingredient, index) => (
                        <li key={index} className="text-sm text-gray-900 list-decimal px-2">
                            {ingredient.name || ingredient.original}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
