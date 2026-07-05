import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from "../../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/reducers/userSlice.js";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from 'react-icons/fa';
import { toast } from "react-toastify";

function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleGoogleClick = async (e) => {
        if (e) e.preventDefault();
        if (loading) return;

        try {
            setLoading(true);
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });

            const result = await signInWithPopup(auth, provider);

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
                credentials: 'include',
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to sync user with database");
            }
            dispatch(signInSuccess(data));
            toast.success("Signed in with Google successfully!");
            navigate("/");
        } catch (error) {
            console.error("Could not login with Google. Google Authentication Error:", error);
            // Translate common Firebase errors for better readability
            if (error.code === "auth/cancelled-popup-request" || error.code === "auth/popup-closed-by-user") {
                toast.warning("Google login popup was closed.");
            } else {
                toast.error(error.message || "Could not login with Google");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button 
                onClick={handleGoogleClick} 
                disabled={loading}
                type="button" 
                className="bg-green-600 text-lg cursor-pointer text-white flex items-center justify-center gap-2 p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                {loading ? "Signing in..." : "Continue with Google"} 
                {!loading && <FaGoogle className='text-xl' />}
            </button>
        </>
    );
}

export default OAuth;