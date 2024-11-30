'use client'
import { useAuth } from '@/app/context/AuthContext';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';


const Signup = () => {
    const router = useRouter();
    const [credentials, setCredentials] = useState({ email: "", password: "", name: "" });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: '', message: '' });
    const { isLoggedIn } = useAuth()

    useEffect(() => {
        if (isLoggedIn) {
            router.push('/'); 
        }
    }, [isLoggedIn]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ type: '', message: '' });
    
        try {
            const response = await fetch("/api/sign-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: credentials.name,
                    email: credentials.email,
                    password: credentials.password,
                }),
            });
    
            const json = await response.json();
            setLoading(false);
            console.log(response);
            console.log(json);
    
            if (json.success) {
                setAlert({ type: 'success', message: 'You have successfully signed up!' });
    
                // Store token in localStorage
                localStorage.setItem("token", json.authToken);
                localStorage.setItem("userEmail", credentials.email);
    
                // Redirect to login after 1 second
                setTimeout(() => {
                    router.push('/login');
                }, 1000);
            } else {
                setAlert({ type: 'error', message: json.error || 'Sign-up failed. Please try again.' });
            }
    
        } catch (error) {
            setLoading(false);
            setAlert({ type: 'error', message: error.message });
        }
    };
    


    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (alert.message) {
            const timer = setTimeout(() => {
                setAlert({ type: '', message: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-xl w-full max-w-lg px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14 rounded-lg">
                <h2 className="text-2xl sm:text-3xl font-bold font-header text-center text-zinc-700 mb-6 uppercase tracking-wider">
                    Welcome to Kitchen Craft
                </h2>
                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-zinc-700 mb-2 font-bold font-header tracking-wide">
                            Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            id="name"
                            onChange={handleChange}
                            value={credentials.name}
                            required
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 border border-zinc-400 text-zinc-950 focus:outline-none focus:border-teal-600 bg-transparent"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-zinc-700 mb-2 font-bold font-header tracking-wide">
                            Email address
                        </label>
                        <input
                            name="email"
                            type="email"
                            id="email"
                            onChange={handleChange}
                            value={credentials.email}
                            required
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border border-zinc-400 text-zinc-950 focus:outline-none focus:border-teal-600 bg-transparent"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-zinc-700 mb-2 font-bold font-header tracking-wide">
                            Password
                        </label>
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
                            className={`flex text-sm justify-center items-center font-header w-full sm:w-1/2 bg-slate-950 hover:bg-teal-800 text-white py-3 sm:py-4 uppercase text-md font-semibold tracking-wider transition duration-200 ${loading ? "cursor-not-allowed" : ""}`}
                            disabled={loading}
                        >
                            {loading ? <LoaderCircle className="animate-spin text-zinc-200" /> : "Signup"}
                        </button>
                    </div>
                </form>

                <div className="flex items-center justify-center my-4">
                    <div className="border-t border-gray-300 w-full"></div>
                    <span className="text-gray-500 mx-2 font-medium">OR</span>
                    <div className="border-t border-gray-300 w-full"></div>
                </div>

                <p className="text-center text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-500 hover:underline cursor-pointer font-header text-sm">
                        Log in
                    </Link>
                </p>
            </div>

            {alert.message && (
                <div
                    role="alert"
                    aria-live="polite"
                    className={`fixed bottom-4 right-4 mb-4 mr-4 px-6 py-4 rounded shadow-lg transition-opacity duration-300 ${alert.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
                        }`}
                >
                    <span>{alert.message}</span>
                </div>
            )}

        </div>
    )
}

export default Signup;