import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoArrowBackOutline } from "react-icons/io5";
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
} from '../redux/reducers/userSlice.js';
import { FaPhoneAlt, FaMapMarkedAlt, FaUser, FaEnvelope, FaUserTag } from "react-icons/fa";
import { AiOutlineEyeInvisible } from 'react-icons/ai'

function Profile() {
    const { currentUser } = useSelector((state) => state.user);
    const fileRef = useRef();
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
        password: currentUser?.password || "",
        phoneNumber: currentUser?.phoneNumber || "",
        role: currentUser?.role || "user",
        addressInfo: currentUser?.addressInfo?.[0] || {
            country: "",
            city: "",
            address1: "",
            address2: "",
            zipCode: "",
        },
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentUser) navigate("/sign-in");
    }, [currentUser, navigate]);

    if (!currentUser) return null;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setFileUploadError(true);
                setFilePerc(0);
                return;
            }
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = async (file) => {
        try {
            setFileUploadError(false);
            setFilePerc(0);

            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
            data.append('folder', 'multi_vendor_images');

            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const progress = Math.round((e.loaded / e.total) * 100);
                    setFilePerc(progress);
                }
            });

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    const res = JSON.parse(xhr.responseText);
                    if (xhr.status === 200 && res.secure_url) {
                        setFormData((prev) => ({ ...prev, avatar: res.secure_url }));
                    } else {
                        console.error("Upload failed:", res);
                        setFileUploadError(true);
                    }
                }
            };

            xhr.send(data);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error('Image Upload failed!');
            setFileUploadError(true);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name in formData.addressInfo) {
            setFormData((prev) => ({
                ...prev,
                addressInfo: {
                    ...prev.addressInfo,
                    [name]: value
                }
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            dispatch(updateUserStart());
            const submitData = {
                ...formData,
                addressInfo: [formData.addressInfo]
            };
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(submitData),
            });

            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                toast.error(data.message);
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
            toast.success("Profile updated successfully!");
        } catch (error) {
            dispatch(updateUserFailure(error.message))
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
            toast.success('User has been deleted successfully!');
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
            toast.error('Something went wrong. Account can not be deleted!');
        }
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (currentUser) {
            setFormData({
                username: currentUser.username || "",
                email: currentUser.email || "",
                password: "",
                phoneNumber: currentUser.phoneNumber || "",
                role: currentUser.role || "user",
                addressInfo: currentUser.addressInfo?.[0] || {
                    country: "",
                    city: "",
                    address1: "",
                    address2: "",
                    zipCode: "",
                },
            });
        }
    }, [currentUser]);

    const renderProfileAvatar = () => {
        const avatarUrl = formData.avatar || currentUser.avatar;
        if (avatarUrl && avatarUrl !== "" && avatarUrl !== "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png") {
            return (
                <img
                    src={avatarUrl}
                    alt="profile"
                    onClick={() => fileRef.current.click()}
                    className="w-28 h-28 rounded-full cursor-pointer object-cover border-4 border-white shadow-lg group-hover:opacity-90 transition"
                />
            );
        }
        
        const firstChar = currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : "?";
        const colors = [
            "bg-red-500", "bg-blue-500", "bg-green-600", "bg-yellow-500", 
            "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
        ];
        const charCode = firstChar.charCodeAt(0) || 0;
        const colorClass = colors[charCode % colors.length];
        
        return (
            <div 
                onClick={() => fileRef.current.click()}
                className={`w-28 h-28 rounded-full ${colorClass} text-white flex items-center justify-center font-bold text-4xl uppercase border-4 border-white shadow-lg group-hover:opacity-90 transition cursor-pointer select-none`}
            >
                {firstChar}
            </div>
        );
    };

    return (
        <>
            <div className="w-full min-h-screen bg-gray-50 py-10 px-4">
                <div className="max-w-3xl mx-auto flex items-center mb-6">
                    <Link to='/' className="flex items-center gap-2 font-medium text-gray-700 hover:text-[#0c513f] transition cursor-pointer" >
                        <IoArrowBackOutline className="text-2xl" />
                        <span>Back to Home</span>
                    </Link>
                </div>
                <div className="max-w-3xl mx-auto bg-white shadow-md border border-gray-100 rounded-3xl overflow-hidden">
                    <form onSubmit={handleSubmit} className="flex flex-col p-6 sm:p-8 gap-8">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center text-center">
                            <div className="relative group">
                                <input
                                    onChange={(e) => setFile(e.target.files[0])}
                                    type='file'
                                    ref={fileRef}
                                    hidden
                                    accept='image/*'
                                />
                                {renderProfileAvatar()}
                                <div 
                                    onClick={() => fileRef.current.click()}
                                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                >
                                    Change Photo
                                </div>
                            </div>
                            
                            <p className='text-sm mt-3 font-medium'>
                                {fileUploadError ? (
                                    <span className='text-red-600'>
                                        Error uploading image (Must be less than 2MB)
                                    </span>
                                ) : filePerc > 0 && filePerc < 100 ? (
                                    <span className='text-green-600'>{`Uploading ${filePerc}%`}</span>
                                ) : filePerc === 100 ? (
                                    <span className='text-green-600 font-semibold'>Image uploaded successfully!</span>
                                ) : (
                                    <span className="text-gray-400 font-normal">Click image to upload new avatar</span>
                                )}
                            </p>
                            <p className="text-xs italic text-gray-400 mt-1">Member since {new Date(currentUser.createdAt).toLocaleDateString()}</p>
                        </div>

                        {/* Form Body split into clean grid sections */}
                        <div className="space-y-6">
                            {/* Section 1: Account Information */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-150 pb-2 mb-4">Account Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FaUser className="text-gray-400 text-xs" />Username</label>
                                        <input 
                                            type="text" 
                                            name="username" 
                                            placeholder="Enter username" 
                                            value={formData.username} 
                                            onChange={handleChange} 
                                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-600 transition" 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FaEnvelope className="text-gray-400 text-xs" />Email Address</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            placeholder="Enter email" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-600 transition" 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><AiOutlineEyeInvisible className="text-gray-400 text-xs" />Update Password (Leave blank to keep current)</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        placeholder="Enter new password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-600 transition" 
                                    />
                                </div>
                            </div>

                            {/* Section 2: Contact & Account Type */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-150 pb-2 mb-4">Contact & Role</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FaPhoneAlt className="text-gray-400 text-xs" />Phone Number</label>
                                        <input 
                                            type="text" 
                                            name="phoneNumber" 
                                            placeholder="Enter phone number" 
                                            value={formData.phoneNumber} 
                                            onChange={handleChange} 
                                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-600 transition" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><FaUserTag className="text-gray-400 text-xs" />Account Type</label>
                                        <select
                                            name="role"
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 bg-white outline-none focus:border-green-600 transition cursor-pointer"
                                            value={formData.role}
                                        >
                                            <option value="user">Customer (Buy products)</option>
                                            <option value="seller">Seller (Sell & manage products)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Shipping / Delivery Details */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-150 pb-2 mb-4 flex items-center gap-2"><FaMapMarkedAlt className="text-green-700" />Shipping & Delivery Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 1</label>
                                        <input 
                                            type="text"
                                            name="address1"
                                            placeholder="Street address, P.O. box, company name"
                                            value={formData.addressInfo.address1}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-600 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 2 (Optional)</label>
                                        <input 
                                            type="text"
                                            name="address2"
                                            placeholder="Apartment, suite, unit, building, floor, etc."
                                            value={formData.addressInfo.address2}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-600 transition"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                                            <input 
                                                type="text"
                                                name="city"
                                                placeholder="City"
                                                value={formData.addressInfo.city}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-600 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                                            <input 
                                                type="text"
                                                name="country"
                                                placeholder="Country"
                                                value={formData.addressInfo.country}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-600 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Zip Code</label>
                                            <input 
                                                type="text"
                                                name="zipCode"
                                                placeholder="Zip Code"
                                                value={formData.addressInfo.zipCode}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-600 transition"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-gray-100 pt-6">
                            <button
                                type="submit"
                                className="w-full sm:w-auto bg-[#003d29] text-white py-2.5 px-6 font-semibold rounded-full hover:bg-[#002e1f] transition cursor-pointer"
                                disabled={loading}
                            >
                                {loading ? 'Saving Changes...' : 'Save Changes'}
                            </button>

                            <button
                                type="button"
                                className="w-full sm:w-auto bg-red-650 hover:bg-red-50 text-red-650 hover:text-red-700 border border-red-200 py-2.5 px-6 font-semibold rounded-full transition cursor-pointer"
                                disabled={loading} 
                                onClick={handleDeleteUser}
                            >
                                Delete Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Profile;
