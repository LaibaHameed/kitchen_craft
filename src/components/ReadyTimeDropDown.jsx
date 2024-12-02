import React from 'react';

const ReadyTimeDropDown = ({
    timeRef,
    maxReadyTime,
    maxReadyTimeOpen,
    setMaxReadyTimeOpen,
    handleMaxTimeChange,
}) => {
    const times = [15, 30, 60, 120]; // Available time options in minutes

    return (
        <div className="space-y-1 sm:max-w-52 w-72">
            <h3 className="sm:text-sm text-xs font-header text-teal-700 mt-2">
                Max Ready Time (Minutes)
            </h3>
            <div className="relative" ref={timeRef}>
                {/* Dropdown Toggle Button */}
                <button
                    type="button"
                    onClick={() => setMaxReadyTimeOpen(!maxReadyTimeOpen)}
                    className="w-full font-body font-semibold text-xs p-3 border border-teal-600 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    {maxReadyTime ? `${maxReadyTime} Minutes` : "Select Ready Time"}
                </button>

                {/* Dropdown Menu */}
                {maxReadyTimeOpen && (
                    <div className="absolute w-full mt-2 bg-white border border-teal-600 rounded-lg shadow-md z-10">
                        {times.map((time) => (
                            <button
                                key={time}
                                type="button"
                                onClick={() => {
                                    handleMaxTimeChange(time); // Pass the selected time back to the parent component
                                    setMaxReadyTimeOpen(false); // Close the dropdown
                                }}
                                className="w-full text-xs p-2 text-left hover:bg-teal-100"
                            >
                                Ready in {'<'} {time} Minutes
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                handleMaxTimeChange(121); // Use 121 to represent '> 120 Minutes'
                                setMaxReadyTimeOpen(false); // Close the dropdown
                            }}
                            className="w-full text-xs p-2 text-left hover:bg-teal-100"
                        >
                            Ready in {'>'} 120 Minutes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReadyTimeDropDown;
