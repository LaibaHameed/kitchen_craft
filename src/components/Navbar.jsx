'use client';
import { useAuth } from "@/app/context/AuthContext";
import { Heart, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const [showProfilePopup, setShowProfilePopup] = useState(false); // State for profile popup

    const toggleProfilePopup = () => {
        setShowProfilePopup((prev) => !prev); // Toggle visibility
    };

    return (
        <header className="bg-white dark:bg-gray-900 shadow-md">
            <div className="mx-auto max-w-screen-xl px-4 py-2 sm:px-6 lg:px-8">
                <div className="flex sm:h-16 h-12 items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex-1 flex items-center">
                        <Link
                            className="block text-teal-600 dark:text-teal-300 sm:text-2xl text-xl font-semibold font-header"
                            href="/"
                        >
                            KitchenCrafts
                        </Link>
                    </div>

                    {/* Links Section */}
                    <div className="flex items-center gap-6">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-4">
                                {/* Favorites Link */}
                                <div className="group relative">
                                    <Link
                                        href={'/favorites'}
                                        className="bg-teal-600 p-1  hover:bg-teal-500 cursor-pointer flex items-center justify-center"
                                    >
                                        <Heart className="text-white" height={20} />
                                    </Link>
                                    <span className="absolute left-1/2 transform -translate-x-1/2 top-0 mt-10 text-xs bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-800 px-2 py-1 rounded-lg">
                                        Favorites Recipes
                                    </span>
                                </div>

                                {/* Profile Icon with Popup */}
                                <div className="relative">
                                    <div
                                        onClick={toggleProfilePopup}
                                        className="bg-teal-600 p-1  hover:bg-teal-500 cursor-pointer flex items-center justify-center"
                                    >
                                        <User className="text-white" height={20} />
                                    </div>

                                    {showProfilePopup && (
                                        <div
                                            className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg p-2 w-60 z-50"
                                        >
                                            {/* Close Icon */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowProfilePopup(false)} // Close the popup
                                                    className="absolute top-0 right-0 text-gray-600 hover:text-gray-800"
                                                >
                                                    ✖
                                                </button>
                                            </div>

                                            {/* Profile Popup Content */}
                                            <div className="flex flex-col items-center mb-4">
                                                <h3 className="text-lg font-bold m-2 font-header">Welcome</h3>
                                                <p className="text-sm mb-4">
                                                    You are signed in as <br />
                                                    <span className="font-medium text-muted">{user?.email}</span>
                                                </p>
                                                <button
                                                    className="rounded-md bg-red-500 px-4 py-2 text-xs font-header cursor-pointer text-white shadow hover:bg-red-600 font-semibold"
                                                    onClick={logout}
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-teal-500 transition-colors"
                                    href="/login"
                                >
                                    Login
                                </Link>

                                {/* <Link
                                    className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 hover:bg-gray-300 hover:text-teal-800 transition-colors"
                                    href="/sign-up"
                                >
                                    Register
                                </Link> */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
