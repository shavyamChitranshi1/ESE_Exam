import { Link } from 'react-router-dom';

const Error404 = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">404</h1>
            <p className="text-2xl font-bold text-gray-800 mt-4">Page Not Found</p>
            <p className="text-gray-600 mt-2 mb-8 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
            <Link to="/" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition shadow-md">
                Go Back Home
            </Link>
        </div>
    );
};

export default Error404;
