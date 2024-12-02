// context/AuthContext.js
'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const router = useRouter();

    const isTokenValid = (token) => {
        // if (!token) return false;
        try {
            const decoded = jwt.decode(token);
            return decoded;
        } catch (error) {
            console.error('Invalid token:', error);
            return false;
        }
    };

    // Fetch favorites when the user is logged in
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const userEmail = localStorage.getItem('userEmail');

        // Validate the token and userEmail
        if (storedToken && userEmail && isTokenValid(storedToken)) {
            setToken(storedToken);
            setIsLoggedIn(true);
            setUser({ email: userEmail });
        } else {
            logout(); // Clear invalid tokens and reset state
        }

        const fetchFavorites = async () => {
            if (isLoggedIn && token) {
                try {
                    const response = await axios.get('/api/favorites', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setFavorites(response.data.favorites | []);
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                }
            }
        };

        fetchFavorites();
    }, [isLoggedIn, token]);

    const login = (token, userDetails) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', userDetails.email);
        setIsLoggedIn(true);
        setUser(userDetails);
        setToken(token);
        router.push('/'); // Redirect to the dashboard
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setIsLoggedIn(false);
        setUser(null);
        setToken(null);
        setFavorites([]); // Clear favorites on logout
        router.push('/'); // Redirect to login page
    };

    const addToFavorites = async (recipe) => {
        if (!isLoggedIn || !token) return;
        try {
            await axios.post(
                '/api/favorites',
                { recipeId: recipe.id, title: recipe.title, image: recipe.image },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFavorites((prevFavorites) => [...prevFavorites, recipe]); // Update favorites in state
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    const removeFromFavorites = async (recipeId) => {
        if (!isLoggedIn || !token) return;
        try {
            await axios.delete('/api/favorites', {
                headers: { Authorization: `Bearer ${token}` },
                data: { recipeId },
            });
            setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.recipeId !== recipeId)); // Remove from state
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                login,
                logout,
                user,
                token,
                favorites,
                addToFavorites,
                removeFromFavorites,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
