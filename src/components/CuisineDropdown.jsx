'use client';

const CuisineDropdown = ({ selectedCuisine, cuisineOpen, setCuisineOpen, handleCuisineChange, cuisineRef }) => {
    const cuisines = [
        "African", "Asian", "American", "British", "Cajun",
        "Caribbean", "Chinese", "Eastern European", "European", "French",
        "German", "Greek", "Indian", "Irish", "Italian", "Japanese",
        "Jewish", "Korean", "Latin American", "Mediterranean", "Mexican",
        "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"
    ];

    return (
        <div className="space-y-1 sm:max-w-52 w-72">
            <h3 className="sm:text-sm text-xs font-header text-teal-700 mt-2">Cuisines</h3>
            <div className="relative" ref={cuisineRef}>
                <button
                    type="button"
                    onClick={() => setCuisineOpen(!cuisineOpen)}
                    className="w-full font-body font-semibold text-xs p-3 border border-teal-600 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    {selectedCuisine.length > 0 ? selectedCuisine.join(', ') : "Select Cuisines"}
                </button>

                {cuisineOpen && (
                    <div className="absolute w-full mt-2 bg-white border border-teal-600 rounded-lg shadow-md z-10">
                        {cuisines.map((cuisine) => (
                            <label key={cuisine} className="w-full text-xs p-2 text-left flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={cuisine}
                                    checked={selectedCuisine.includes(cuisine)}
                                    onChange={() => handleCuisineChange(cuisine)}
                                    className="form-checkbox text-xs text-teal-600 mr-2"
                                />
                                {cuisine}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CuisineDropdown;
