import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail } from 'react-icons/ai';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess, signInStart, signInFailure } from "../redux/reducers/userSlice.js";
import OAuth from "../components/OAuth";
import sideImg from '../images/side_img2.jpg';
import { toast } from 'react-toastify';

// Inline SVG Logo for Shopcart
const Logo = () => (
  <div className="flex items-center gap-2 font-sans select-none mb-6">
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

function SignIn () {
    const [formData, setFormData] = useState({
       
    });
    const { loading } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            dispatch(signInStart());
            const res = await fetch("/api/auth/signin", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                dispatch(signInFailure(data.message));
                toast.error(data.message || "Something went wrong!");
                return;
            }

            dispatch(signInSuccess(data));
            toast.success("Sign in successful!");
            navigate('/');
        } catch (error) {
            dispatch(signInFailure(error.message));
            toast.error('User not found. Please enter right details or create account!');    
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen">
            <div className="w-full md:w-[768px] p-4 flex flex-col justify-center items-start md:ml-4 mt-6 md:mt-0">
                <Logo />
                <h1 className="text-3xl font-semibold mb-4 font-sans">Login to your account</h1>
                <p className="font-bold text-lg mb-6">
                    Don't have an account?{' '}
                    <Link to={"/sign-up"}><span className="text-blue-600 font-semibold text-xl cursor-pointer">Sign up</span></Link>
                </p>
                <form className="flex flex-col gap-4 w-full relative" onSubmit={handleSubmit}>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Enter email"
                            id="email"
                            className="border p-3 pr-10 rounded-lg border-gray-400 focus:outline-sky-600 w-full"
                            onChange={handleChange}
                        />
                        <AiOutlineMail
                            className="absolute top-3 right-3 text-gray-600"
                            size={22}
                        />
                    </div>
                    <div className="relative">
                        <input
                            type={visible ? 'text' : 'password'}
                            placeholder="Enter password"
                            required
                            autoComplete="current-password"
                            className="border p-3 pr-10 rounded-lg border-gray-400 focus:outline-sky-600 w-full"
                            id="password"
                            onChange={handleChange}
                        />
                        {visible ? (
                            <AiOutlineEye
                                className="absolute top-3 right-3 text-gray-600 cursor-pointer"
                                size={24}
                                onClick={() => setVisible(false)}
                            />
                        ) : (
                            <AiOutlineEyeInvisible
                                className="absolute top-3 right-3 text-gray-600 cursor-pointer"
                                size={24}
                                onClick={() => setVisible(true)}
                            />
                        )}
                    </div>

                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <input type="checkbox" name='remember-me' id='remember-me' className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded' />
                            <label htmlFor="remember-me" className='ml-2 block text-sm text-gray-900'>Remember me</label>
                        </div>
                        <div className='text-sm'>
                            <a href="/update-password" className='text-blue-600 hover:text-blue-500 font-semibold'>Forget your password?</a>
                        </div>
                    </div>
                    
                    <button disabled={loading} className="bg-green-600 text-white p-3 text-lg rounded-lg uppercase cursor-pointer hover:opacity-95 disabled:opacity-80">
                        {loading ? 'Loading' : 'Sign in'}
                    </button>
                    <div className="flex items-center justify-center my-3">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          <OAuth />
                </form>
            </div>

            <div className="hidden md:block w-full h-screen">
                <img src={sideImg} alt="side_img" className="w-full h-full object-cover" />
            </div>
        </div>
    );
}

export default SignIn;
