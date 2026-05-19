import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });

    useEffect(() => {
        const fetchComplaints = async () => {
            try {

                const userId = user._id || user.id;
                const res = await api.get(`/complaints?user=${userId}`);
                const userComplaints = res.data.data;
                setComplaints(userComplaints);

                const total = userComplaints.length;
                const pending = userComplaints.filter(c => c.status === 'Pending').length;
                const inProgress = userComplaints.filter(c => c.status === 'In Progress').length;
                const resolved = userComplaints.filter(c => c.status === 'Resolved').length;

                setStats({ total, pending, inProgress, resolved });
            } catch (err) {
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        if(user) fetchComplaints();
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center h-[calc(100vh-64px)]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, {user.name}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-medium">Total Complaints</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                    <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pending}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                    <h3 className="text-gray-500 text-sm font-medium">In Progress</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.inProgress}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-medium">Resolved</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.resolved}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Recent Complaints</h2>
                <Link to="/complaints/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-md">
                    + Register New Complaint
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-xl overflow-hidden">
                {complaints.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {complaints.slice(0, 5).map(complaint => (
                                <tr key={complaint._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                                            complaint.status === 'In Progress' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {complaint.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(complaint.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/complaints/${complaint._id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No complaints registered yet. <Link to="/complaints/new" className="text-indigo-600 font-medium">Create one now.</Link>
                    </div>
                )}
            </div>
            {complaints.length > 5 && (
                <div className="mt-4 text-right">
                    <Link to="/complaints" className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">View All Complaints &rarr;</Link>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
