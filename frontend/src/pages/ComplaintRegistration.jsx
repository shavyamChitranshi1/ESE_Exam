import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ComplaintRegistration = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        title: '',
        description: '',
        category: '',
        location: ''
    });
    
    const [aiResult, setAiResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const analyzeComplaint = async () => {
        if (!formData.title || !formData.description) {
            toast.warning('Please fill in title and description first');
            return;
        }

        setIsAnalyzing(true);
        try {
            const res = await api.post('/ai/analyze', {
                title: formData.title,
                description: formData.description
            });
            setAiResult(res.data.data);
            toast.success('AI Analysis complete!');
        } catch (err) {
            toast.error('Failed to analyze complaint');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const payload = { ...formData };
            
            if (aiResult) {
                payload.aiPriority = aiResult.priority;
                payload.aiDepartment = aiResult.department;
                payload.aiSummary = aiResult.summary;
                payload.aiResponse = aiResult.response;
            }
            
            await api.post('/complaints', payload);
            toast.success('Complaint registered successfully!');
            navigate('/complaints');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to register complaint');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                    <h2 className="text-2xl font-bold text-white">Register New Complaint</h2>
                    <p className="text-blue-100 mt-2">Fill in the details below. Our AI will analyze your issue for faster processing.</p>
                </div>
                
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border bg-gray-50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border bg-gray-50" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Complaint Title</label>
                            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border" placeholder="e.g. Water leak on main street" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border" placeholder="Please describe the issue in detail..."></textarea>
                        </div>

                        <div className="flex justify-end">
                            <button type="button" onClick={analyzeComplaint} disabled={isAnalyzing} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50">
                                {isAnalyzing ? 'Analyzing with AI...' : '✨ Analyze with AI (Optional)'}
                            </button>
                        </div>

                        {aiResult && (
                            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
                                <h3 className="text-lg font-medium text-indigo-900 mb-4 flex items-center">
                                    <span className="mr-2">✨</span> AI Analysis Result
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-indigo-600 uppercase font-bold">Suggested Priority</p>
                                        <p className="font-medium text-gray-900">{aiResult.priority}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-600 uppercase font-bold">Target Department</p>
                                        <p className="font-medium text-gray-900">{aiResult.department}</p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <p className="text-xs text-indigo-600 uppercase font-bold">Generated Summary</p>
                                    <p className="text-gray-800 text-sm italic">"{aiResult.summary}"</p>
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-600 uppercase font-bold">Automated Response</p>
                                    <p className="text-gray-800 text-sm bg-white p-3 rounded border border-indigo-100">{aiResult.response}</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select name="category" required value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border">
                                    <option value="">Select a category</option>
                                    <option value="Water">Water</option>
                                    <option value="Electricity">Electricity</option>
                                    <option value="Sanitation">Sanitation</option>
                                    <option value="Roads">Roads</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <input type="text" name="location" required value={formData.location} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border" placeholder="e.g. City Center, Ghaziabad" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50">
                                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ComplaintRegistration;
