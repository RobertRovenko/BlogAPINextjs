"use client";

import React, { useState } from "react";
import Link from "next/link";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    // Perform signup logic here
    console.log("Signing up with:", email, password);
  };

  const handleLogin = () => {
    // Perform login logic here
    console.log("Logging in with:", email, password);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">Notes</h1>
        </div>
      </header>
      <div className="container mx-auto mt-8">
        <h1 className="text-center text-3xl font-semibold mb-4">
          Welcome to your personal notes on the go!
        </h1>
        <p className="text-center">
          Create an account or login to start taking notes!
        </p>

        {/* Signup form */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center"></h2>
          <form className="max-w-md mx-auto">
            <label className="block mb-2 font-bold">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <label className="block mt-4 mb-2 font-bold">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <div className="flex justify-center mt-6">
              <Link href="/homescreen" className="btn btn-primary mr-4">
                Signup
              </Link>
              <Link href="/homescreen" className="btn btn-secondary">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto">
          <p className="text-center">© 2023 Made by Robert Falkbäck Rovenko</p>
        </div>
      </footer>
    </div>
  );
};

export default Signup;
