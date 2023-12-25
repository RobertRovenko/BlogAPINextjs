"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "../../firebase"; // Import the exported auth instance
import { useRouter } from "next/navigation";

const Signup: React.FC = () => {
  // Use WithRouterProps
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Access the UID
      const uid = user.uid;

      console.log("Signup successful with UID:", uid);

      // Redirect to homescreen on successful signup
      router.replace("/homescreen");
      console.log("Signup successful with UID:", uid);
    } catch (error: unknown) {
      if (error instanceof Error && "message" in error) {
        // Handle other general errors
        console.error("Error during signup:", (error as Error).message);
      } else {
        // Handle unknown errors
        console.error("Unknown error during signup:", error);
      }
    }
  };

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Login successful:", user);

      // Redirect to homescreen on successful login
      router.push("/homescreen");
      console.log("Login successful:", user);
    } catch (error: unknown) {
      // Handle login errors
    }
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
              <button onClick={handleSignup} className="btn btn-primary mr-4">
                Signup
              </button>
              <button
                onClick={(e) => handleLogin(e)}
                className="btn btn-secondary"
              >
                Login
              </button>
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
