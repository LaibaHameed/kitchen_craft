'use client'

import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const Login = () => {
    const router = useRouter();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: '', message: '' });
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ type: '', message: '' });

        // Check if fields are filled
        if (!credentials.email || !credentials.password) {
            setAlert({ type: 'error', message: 'Please enter both email and password' });
            setLoading(false);
            return;
        }

        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
            }),
        });

        const json = await response.json();
        setLoading(false);

        if (json.success) {
            // Assuming json returns the email and userName if needed
            const userDetails = { email: credentials.email };
            setAlert({ type: 'success', message: 'You have successfully logged in!' });

            // Store in localStorage
            localStorage.setItem("token", json.authToken);
            localStorage.setItem("userEmail", credentials.email);
            // No need for `userDetails.name` unless returned from the backend
            // localStorage.setItem("userName", userDetails.name);

            // Redirect and login action
            router.push('/');
            login(json.authToken, userDetails);

        } else {
            setAlert({ type: 'error', message: json.error || 'Login failed. Please try again.' });
        }
    };

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (alert.message) {
            const timer = setTimeout(() => {
                setAlert({ type: '', message: '' });
            }, 3000); // Adjust time as needed
            return () => clearTimeout(timer);
        }
    }, [alert]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="bg-white shadow-xl w-full max-w-lg px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14 rounded-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-zinc-700 mb-6 uppercase tracking-wider">
                    Welcome Back
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-zinc-700 mb-2 font-bold tracking-wide">Email</label>
                        <input
                            name="email"
                            type="text"
                            id="email"
                            onChange={handleChange}
                            value={credentials.email}
                            required
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border border-zinc-400 text-zinc-950 focus:outline-none focus:border-teal-600 bg-transparent"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-zinc-700 mb-2 font-bold tracking-wide">Password</label>
                        <input
                            name="password"
                            type="password"
                            id="password"
                            onChange={handleChange}
                            value={credentials.password}
                            required
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border border-zinc-400 text-zinc-950 focus:outline-none focus:border-teal-600 bg-transparent"
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className={`w-full sm:w-1/2 bg-slate-950 hover:bg-teal-800 text-white py-3 sm:py-4 uppercase text-md font-semibold tracking-wider transition duration-200 flex justify-center items-center ${loading ? "cursor-not-allowed" : ""}`}
                            disabled={loading}
                        >
                            {loading ? <LoaderCircle className="animate-spin text-zinc-200" /> : "Login"}
                        </button>
                    </div>
                </form>

                <div className="flex items-center justify-center my-4">
                    <div className="border-t border-gray-300 w-full"></div>
                    <span className="text-gray-500 mx-2 font-medium">OR</span>
                    <div className="border-t border-gray-300 w-full"></div>
                </div>

                <p className="text-center text-gray-600 mt-6">
                    Don&#39;t have an account?{' '}
                    <Link href="/sign-up" className="text-blue-500 hover:underline cursor-pointer">
                        Sign up
                    </Link>
                </p>
            </div>

            {alert.message && (
                <div className={`fixed bottom-4 right-4 mb-4 mr-4 px-6 py-4 rounded shadow-lg transition-opacity duration-300 ${alert.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
                    <span>{alert.message}</span>
                </div>
            )}
        </div>
    );
};

export default Login;
