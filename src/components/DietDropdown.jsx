'use client';

const DietDropdown = ({ selectedDiet, dietOpen, setDietOpen, handleDietChange, dietRef }) => {
    const diets = [
        "Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian",
        "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo",
        "Primal", "Low FODMAP", "Whole30"
    ];

    return (
        <div className="space-y-1 sm:max-w-52 w-72">
            <h3 className="sm:text-sm text-xs font-header text-teal-700 mt-2">Diet Definitions</h3>
            <div className="relative" ref={dietRef}>
                <button
                    type="button"
                    onClick={() => setDietOpen(!dietOpen)}
                    className="w-full font-body font-semibold text-xs p-3 border border-teal-600 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    {selectedDiet.length > 0 ? selectedDiet.join(', ') : "Select Diets"}
                </button>

                {dietOpen && (
                    <div className="absolute w-full mt-2 bg-white border border-teal-600 rounded-lg shadow-md z-10">
                        {diets.map((diet) => (
                            <label key={diet} className="w-full text-xs p-2 text-left flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={diet}
                                    checked={selectedDiet.includes(diet)}
                                    onChange={() => handleDietChange(diet)}
                                    className="form-checkbox text-xs text-teal-600 mr-2"
                                />
                                {diet}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DietDropdown;
