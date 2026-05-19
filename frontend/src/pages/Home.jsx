import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-indigo-100 via-white to-blue-100 text-center px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 drop-shadow-sm">
                AI Smart Complaint Management
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl">
                Experience the next generation of issue resolution. Our AI-powered system automatically analyzes, categorizes, and prioritizes your complaints for rapid handling.
            </p>
            <div className="flex space-x-4">
                <Link to="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                    Get Started Now
                </Link>
                <Link to="/login" className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 rounded-full font-bold text-lg shadow hover:shadow-md transition">
                    Login
                </Link>
            </div>
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                <div className="glass p-8 rounded-2xl">
                    <div className="text-blue-500 text-4xl mb-4">🚀</div>
                    <h3 className="text-xl font-bold mb-2">Fast Resolution</h3>
                    <p className="text-gray-600">AI automatically routes your complaint to the correct department instantly.</p>
                </div>
                <div className="glass p-8 rounded-2xl">
                    <div className="text-indigo-500 text-4xl mb-4">🧠</div>
                    <h3 className="text-xl font-bold mb-2">Smart Analysis</h3>
                    <p className="text-gray-600">Advanced AI understands urgency and context to prioritize critical issues.</p>
                </div>
                <div className="glass p-8 rounded-2xl">
                    <div className="text-green-500 text-4xl mb-4">📊</div>
                    <h3 className="text-xl font-bold mb-2">Real-time Tracking</h3>
                    <p className="text-gray-600">Monitor your complaint status from submission to resolution transparently.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
