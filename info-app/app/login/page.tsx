"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/utils/firebase/client";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa"; // Icone per password
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Per toggle tra registrazione e login
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Utente loggato:", userCredential.user);
      router.push("/"); // Redirect alla home dopo il login
    } catch (err: any) {
      setError(err.message);
      console.error("Errore durante il login:", err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Le password non corrispondono!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Utente registrato:", userCredential.user);
      setIsRegistering(false); // Passa alla vista di login
    } catch (err: any) {
      setError(err.message);
      console.error("Errore durante la registrazione:", err);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Utente loggato con Google:", result.user);
      router.push("/"); // Redirect alla home dopo il login
    } catch (err: any) {
      setError(err.message);
      console.error("Errore durante il login con Google:", err);
    }
  };

  const handleGithubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Utente loggato con GitHub:", result.user);
      router.push("/"); // Redirect alla home dopo il login
    } catch (err: any) {
      setError(err.message);
      console.error("Errore durante il login con GitHub:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className="w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/path/to/your-image.jpg')" }}
      >
        <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
          <h1 className="text-white text-3xl font-bold">Info-App</h1>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isRegistering ? "Registrati" : "Accedi"}
          </h2>

          <form
            onSubmit={isRegistering ? handleRegister : handleLogin}
            className="space-y-4"
          >
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 border rounded-lg shadow-sm"
              />
            </div>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 border rounded-lg shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {isRegistering && (
              <div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Conferma Password"
                  className="w-full p-3 border rounded-lg shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-10 text-gray-500"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            )}
            {error && <div className="text-red-500 text-center">{error}</div>}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {isRegistering ? "Registrati" : "Accedi"}
            </button>
          </form>

          <div className="my-4 text-center text-gray-600">o accedi con</div>

          <div className="flex space-x-4">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center space-x-2 w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              <FaGoogle />
              <span>Google</span>
            </button>

            <button
              onClick={handleGithubLogin}
              className="flex items-center justify-center space-x-2 w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition duration-300"
            >
              <FaGithub />
              <span>GitHub</span>
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-500"
            >
              {isRegistering
                ? "Già registrato? Accedi"
                : "Non hai un account? Registrati"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
