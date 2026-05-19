const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add your name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email']
    },
    title: {
        type: String,
        required: [true, 'Please add a complaint title']
    },
    description: {
        type: String,
        required: [true, 'Please add a complaint description']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    aiPriority: {
        type: String
    },
    aiDepartment: {
        type: String
    },
    aiSummary: {
        type: String
    },
    aiResponse: {
        type: String
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
