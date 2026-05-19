import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="font-bold text-2xl tracking-wider">AI Smart Complaint</Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="hover:bg-indigo-600 px-3 py-2 rounded-md font-medium transition">Dashboard</Link>
                                <Link to="/complaints" className="hover:bg-indigo-600 px-3 py-2 rounded-md font-medium transition">Complaints</Link>
                                <div className="flex items-center space-x-2 border-l pl-4 border-indigo-400">
                                    <span className="font-medium">{user.name}</span>
                                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium transition flex items-center">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:bg-indigo-600 px-4 py-2 rounded-md font-medium transition">Login</Link>
                                <Link to="/signup" className="bg-white text-indigo-700 hover:bg-gray-100 px-4 py-2 rounded-md font-bold transition shadow">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
