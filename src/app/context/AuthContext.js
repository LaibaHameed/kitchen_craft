'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const router = useRouter();

    const isTokenValid = (token) => {
        try {
            const decoded = jwt.decode(token);
            return decoded;
        } catch (error) {
            console.error('Invalid token:', error);
            return false;
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const userEmail = localStorage.getItem('userEmail');

        if (storedToken && userEmail && isTokenValid(storedToken)) {
            setToken(storedToken);
            setIsLoggedIn(true);
            setUser({ email: userEmail });
        } else {
            logout(); // Clear invalid tokens
        }
    }, []);

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
        router.push('/'); // Redirect to login page
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, user, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
