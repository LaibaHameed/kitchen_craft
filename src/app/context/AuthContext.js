'use client'

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem('token'));
            console.log(token);
            const userEmail = localStorage.getItem('userEmail');
            if (token && userEmail) {
                setIsLoggedIn(true);
                setUser({ email: userEmail }); // Assuming only email for now
            }
        }
    }, []);

    const login = (token, userDetails) => {
        console.log("Token in login:", token);
        try {
            localStorage.setItem('token', token);
            localStorage.setItem('userEmail', userDetails.email);
            setIsLoggedIn(true);
            setUser(userDetails);
            // Redirect to the desired page after login
            router.push('/'); // Or another route
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            setIsLoggedIn(false);
            setUser(null);
            router.push('/'); // Redirect to login page
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    console.log("User from AuthContext:", user); // Add logging here to verify user data

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, user, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
