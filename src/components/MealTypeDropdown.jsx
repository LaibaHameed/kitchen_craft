'use client';

const MealTypeDropdown = ({ mealType, mealTypeOpen, setMealTypeOpen, handleMealTypeChange, mealRef }) => {
    const mealTypes = [
        "main course", "side dish", "dessert", "appetizer",
        "salad", "bread", "breakfast", "soup",
        "beverage", "sauce", "marinade", "fingerfood",
        "snack", "drink"
    ];

    return (
        <div className="space-y-1 sm:max-w-52 w-72">
            <h3 className="sm:text-sm text-xs font-header text-teal-700 mt-2">Meal Type</h3>
            <div className="relative" ref={mealRef}>
                <button
                    type="button"
                    onClick={() => setMealTypeOpen(!mealTypeOpen)}
                    className="w-full font-body font-semibold text-xs p-3 border border-teal-600 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    {mealType || "Select Meal Type"}
                </button>

                {mealTypeOpen && (
                    <div className="absolute w-full mt-2 bg-white border border-teal-600 rounded-lg shadow-md z-10">
                        {mealTypes.map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => {
                                    handleMealTypeChange(type);
                                    setMealTypeOpen(false)
                                }}
                                className="w-full text-xs p-2 text-left hover:bg-teal-100"
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MealTypeDropdown;
