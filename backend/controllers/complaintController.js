const Complaint = require('../models/Complaint');

exports.getComplaints = async (req, res, next) => {
    try {
        let query;

        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Support for searching by location or filtering by category
        if (req.query.location) {
            reqQuery.location = { $regex: req.query.location, $options: 'i' };
        }
        
        query = Complaint.find(reqQuery).sort({ createdAt: -1 });

        const complaints = await query;

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.getComplaint = async (req, res, next) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ success: false, error: 'Complaint not found' });
        }

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.createComplaint = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        
        const complaint = await Complaint.create(req.body);

        res.status(201).json({
            success: true,
            data: complaint
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.updateComplaint = async (req, res, next) => {
    try {
        let complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ success: false, error: 'Complaint not found' });
        }

        // Optional: Ensure user is complaint owner or admin
        // if (complaint.user.toString() !== req.user.id) {
        //     return res.status(401).json({ success: false, error: 'Not authorized to update this complaint' });
        // }

        complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.deleteComplaint = async (req, res, next) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ success: false, error: 'Complaint not found' });
        }

        await complaint.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
