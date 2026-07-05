import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";
import sideImg from "../images/side_img1.jpg";

// Inline SVG Logo for Shopcart
const Logo = () => (
  <div className="flex items-center gap-2 font-sans select-none mb-4">
    <svg width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 12 25 L 24 25 L 38 75 L 82 75 L 94 38 L 30 38"
        stroke="#0c513f"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 94 38 L 97 34"
        stroke="#0c513f"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="44" cy="86" r="8" fill="#0c513f" />
      <circle cx="44" cy="86" r="3" fill="#fff" />
      <circle cx="76" cy="86" r="8" fill="#0c513f" />
      <circle cx="76" cy="86" r="3" fill="#fff" />
      <path
        d="M 50 42 C 50 42, 72 42, 72 42 C 68 58, 60 70, 60 70 C 60 70, 52 58, 50 42 Z"
        fill="#f97316"
      />
      <path d="M 54 48 Q 61 50 68 48" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
      <path d="M 56 56 Q 61 58 66 56" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M 54 36 C 54 24, 61 20, 61 20 C 61 20, 68 24, 68 36 Z"
        fill="#22c55e"
      />
      <path d="M 61 32 L 61 20" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <span className="text-3xl font-black text-[#0c513f] tracking-tight">Shopcart</span>
  </div>
);

function SignUp () {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setError(data.message || "Something went wrong");
        toast.error(data.message || "Signup failed");
        return;
      }

      toast.success("Account created successfully!");
      navigate("/sign-in");
    } catch (err) {
      setError(err.message);
      toast.error("Signup failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      <div className="hidden md:block w-[400px] h-screen">
        <img src={sideImg} alt="Signup visual" className="w-full h-full object-cover" />
      </div>

      <div className="w-full md:flex-1 p-4 flex flex-col justify-center items-start md:pl-12 mt-4 md:mt-0">
        <Logo />
        <h1 className="text-3xl font-semibold mb-4">Create your account</h1>

        <p className="font-medium text-base mb-4">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-blue-600 font-semibold hover:underline">
            Log in now
          </Link>
        </p>

        <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              className="border p-3 pr-10 rounded-lg border-gray-400 focus:outline-blue-500 w-full"
              onChange={handleChange}
              required
            />
            <AiOutlineUser className="absolute top-3 right-3 text-gray-600" size={22} />
          </div>

          <div className="relative">
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              className="border p-3 pr-10 rounded-lg border-gray-400 focus:outline-blue-500 w-full"
              onChange={handleChange}
              required
            />
            <AiOutlineMail className="absolute top-3 right-3 text-gray-600" size={22} />
          </div>

          <div className="relative">
            <input
              type={visible ? "text" : "password"}
              id="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="border p-3 pr-10 rounded-lg border-gray-400 focus:outline-blue-500 w-full"
              autoComplete="current-password"
            />
            {visible ? (
              <AiOutlineEye
                onClick={() => setVisible(false)}
                className="absolute top-3 right-3 text-gray-600 cursor-pointer"
                size={22}
              />
            ) : (
              <AiOutlineEyeInvisible
                onClick={() => setVisible(true)}
                className="absolute top-3 right-3 text-gray-600 cursor-pointer"
                size={22}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white text-lg py-3 uppercase rounded-lg hover:opacity-90 disabled:opacity-70 transition"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>

          <div className="flex items-center justify-center my-3">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          <OAuth />
        </form>
      </div>
    </div>
  );
};

export default SignUp;
