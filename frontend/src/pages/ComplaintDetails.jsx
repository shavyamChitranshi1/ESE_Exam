import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState(false);

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const res = await api.get(`/complaints/${id}`);
                setComplaint(res.data.data);
            } catch (err) {
                toast.error('Failed to load complaint details');
                navigate('/complaints');
            } finally {
                setLoading(false);
            }
        };
        fetchComplaint();
    }, [id, navigate]);

    const handleStatusChange = async (newStatus) => {
        setStatusUpdating(true);
        try {
            const res = await api.put(`/complaints/${id}`, { status: newStatus });
            setComplaint(res.data.data);
            toast.success(`Status updated to ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update status');
        } finally {
            setStatusUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this complaint?')) {
            try {
                await api.delete(`/complaints/${id}`);
                toast.success('Complaint deleted successfully');
                navigate('/complaints');
            } catch (err) {
                toast.error('Failed to delete complaint');
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-[calc(100vh-64px)]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>;
    }

    if (!complaint) return null;

    const isOwner = user && complaint.user === user.id;

    
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-6">
                <Link to="/complaints" className="text-indigo-600 hover:text-indigo-800 font-medium">&larr; Back to Complaints</Link>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{complaint.title}</h2>
                        <p className="text-gray-300 mt-1 text-sm">Submitted on {new Date(complaint.createdAt).toLocaleDateString()} at {new Date(complaint.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <span className={`px-4 py-2 inline-flex text-sm leading-5 font-bold rounded-full shadow-sm ${
                        complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                        complaint.status === 'In Progress' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {complaint.status}
                    </span>
                </div>
                
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-gray-100 pb-8">
                        <div className="col-span-2">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                            <p className="text-gray-800 whitespace-pre-wrap">{complaint.description}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Details</h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="block text-xs text-gray-500">Category</span>
                                    <span className="font-medium text-gray-900">{complaint.category}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500">Location</span>
                                    <span className="font-medium text-gray-900">{complaint.location}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500">Complainant</span>
                                    <span className="font-medium text-gray-900">{complaint.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {complaint.aiSummary && (
                        <div className="bg-indigo-50 rounded-xl p-6 mb-8 border border-indigo-100">
                            <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
                                <span className="mr-2">✨</span> AI Analysis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <span className="block text-xs text-indigo-500 uppercase font-bold mb-1">Priority</span>
                                    <span className={`font-bold text-lg ${
                                        complaint.aiPriority?.toLowerCase() === 'high' ? 'text-red-600' : 
                                        complaint.aiPriority?.toLowerCase() === 'medium' ? 'text-orange-600' : 'text-blue-600'
                                    }`}>{complaint.aiPriority}</span>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <span className="block text-xs text-indigo-500 uppercase font-bold mb-1">Recommended Department</span>
                                    <span className="font-bold text-gray-800 text-lg">{complaint.aiDepartment}</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <span className="block text-xs text-indigo-500 uppercase font-bold mb-1">Summary</span>
                                <p className="text-gray-800 bg-white p-4 rounded-lg shadow-sm italic">"{complaint.aiSummary}"</p>
                            </div>
                            <div>
                                <span className="block text-xs text-indigo-500 uppercase font-bold mb-1">AI Response</span>
                                <p className="text-gray-800 bg-white p-4 rounded-lg shadow-sm">{complaint.aiResponse}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div className="mb-4 sm:mb-0">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Update Status</h3>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => handleStatusChange('Pending')}
                                    disabled={statusUpdating || complaint.status === 'Pending'}
                                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md font-medium text-sm hover:bg-yellow-200 disabled:opacity-50 transition"
                                >
                                    Pending
                                </button>
                                <button 
                                    onClick={() => handleStatusChange('In Progress')}
                                    disabled={statusUpdating || complaint.status === 'In Progress'}
                                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md font-medium text-sm hover:bg-purple-200 disabled:opacity-50 transition"
                                >
                                    In Progress
                                </button>
                                <button 
                                    onClick={() => handleStatusChange('Resolved')}
                                    disabled={statusUpdating || complaint.status === 'Resolved'}
                                    className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-medium text-sm hover:bg-green-200 disabled:opacity-50 transition"
                                >
                                    Resolved
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:items-end">
                            <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-2">Danger Zone</h3>
                            <button 
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition shadow-sm"
                            >
                                Delete Complaint
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetails;
