import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const ComplaintList = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    

    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            let query = '/complaints?';
            if (locationFilter) query += `location=${locationFilter}&`;
            if (categoryFilter) query += `category=${categoryFilter}&`;
            
            const res = await api.get(query);
            setComplaints(res.data.data);
        } catch (err) {
            toast.error('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [locationFilter, categoryFilter]);

    const filteredComplaints = complaints.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-purple-100 text-purple-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-orange-600 bg-orange-100';
            case 'low': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">All Complaints</h1>
                <Link to="/complaints/new" className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-md">
                    Register New Complaint
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-100">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input 
                        type="text" 
                        placeholder="Search title or description..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Location</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Ghaziabad" 
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
                    <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                    >
                        <option value="">All Categories</option>
                        <option value="Water">Water</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Sanitation">Sanitation</option>
                        <option value="Roads">Roads</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>
            ) : filteredComplaints.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-10 text-center">
                    <p className="text-gray-500 text-lg">No complaints found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredComplaints.map(complaint => (
                        <div key={complaint._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                            <div className="p-6 flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                                        {complaint.status}
                                    </span>
                                    {complaint.aiPriority && (
                                        <span className={`px-2 py-1 text-xs font-bold rounded ${getPriorityColor(complaint.aiPriority)}`}>
                                            {complaint.aiPriority} Priority
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{complaint.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{complaint.description}</p>
                                
                                <div className="space-y-2 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <span className="font-medium mr-2">Category:</span> {complaint.category}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium mr-2">Location:</span> {complaint.location}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium mr-2">Date:</span> {new Date(complaint.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                                <Link to={`/complaints/${complaint._id}`} className="text-indigo-600 hover:text-indigo-900 font-medium w-full block text-center">
                                    View Details &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ComplaintList;
