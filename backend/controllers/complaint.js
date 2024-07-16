import { Complaint } from "../models/Complaint.js";
import { Student } from "../models/Student.js";
import { Warden } from "../models/Warden.js";

const createComplaint = async (req, res) => {
    try {
        const newPostData = {
            name: req.user.name,
            block_no: req.user.block_no,
            roll_no: req.user.roll_no,
            description: req.body.description,
            room_no: req.user.room_no,
            owner: req.user._id,
            created_at: new Date()
        };

        const post = await Complaint.create(newPostData);

        const user = await Student.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.complaints.push(post._id);

        const warden = await Warden.findOne({ block_no: req.user.block_no });
        if (!warden) {
            return res.status(404).json({
                success: false,
                message: "Warden not found"
            });
        }

        warden.complaints.push(post._id);

        await user.save();
        await warden.save(); // Save the warden document after updating it

        res.status(201).json({
            success: true,
            post
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const deletePostByIdByStudent = async (req, res) => {
    try{                                       //params is used to get the id from the url
        const post = await Complaint.findById(req.params.id); //find post by id 

        if(!post){
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        if(post.owner.toString() !== req.user._id.toString()){ //check if the post belongs to the user
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to delete this post'
            });
        }

        await post.deleteOne(); //remove is deprecated and no need to give id

        const user = await Student.findById(req.user._id); //current user who is logged in

        const index = user.complaints.indexOf(req.params.id);

        user.complaints.splice(index, 1); //delete post from user's post array

        const warden = await Warden.findOne({block_no: post.block_no});

        const index1 = warden.complaints.indexOf(req.params.id);

        warden.complaints.splice(index1, 1); //delete post from warden's post array

        await user.save();
        await warden.save(); // Save the warden document after updating it

        res.status(200).json({
            success: true,
            message: 'Complaint deleted'
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const updateComplaintStatusById = async (req, res) => {

    try{
        const post = await Complaint.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        if(post.block_no.toString() !== req.user.block_no.toString()){ //check if the post belongs to the user
            return res.status(404).json({
                success: false,
                message: 'You are not authorized to update this complaint'
            });
        }

        post.is_completed = true;

        const warden = await Warden.findOne({block_no: post.block_no});

        const index1 = warden.complaints.indexOf(req.params.id);

        warden.complaints.splice(index1, 1); //delete post from warden's post array

        await warden.save();

        await post.save();

        res.status(200).json({
            success: true,
            message: 'Complaint Solved'
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }



}

const getAllComplaintOfStudent = async (req, res) => {
    try {
        const userId = req.user._id;

        const page = parseInt(req.query.page, 10) || 1; // Default to 1 if not provided
        const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 if not provided
        const skip = (page - 1) * limit; // Calculate skip based on page and limit

        // Find the student to get the total number of complaints
        const student = await Student.findById(userId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const totalComplaints = student.complaints.length;
        const totalPages = Math.ceil(totalComplaints / limit);

        // Check if the requested page exceeds the total number of pages
        if (page > totalPages) {
            return res.status(400).json({
                success: false,
                message: `Page ${page} exceeds total number of pages ${totalPages}`
            });
        }

        // Find the student again and populate the complaints array with pagination
        const studentWithComplaints = await Student.findById(userId).populate({
            path: 'complaints',
            options: {
                sort: { created_at: -1 },
                skip,
                limit
            }
        });

        res.status(200).json({
            success: true,
            complaints: studentWithComplaints.complaints,
            totalPages,
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
};

const getAllComplaintOfWarden = async (req, res) => {
    try {
        const userId = req.user._id;

        const page = parseInt(req.query.page, 10) || 1; // Default to 1 if not provided
        const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 if not provided
        const skip = (page - 1) * limit; // Calculate skip based on page and limit

        // Find the student to get the total number of complaints
        const student = await Warden.findById(userId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Warden not found'
            });
        }

        const totalComplaints = student.complaints.length;
        const totalPages = Math.ceil(totalComplaints / limit);

        // Check if the requested page exceeds the total number of pages
        if (page > totalPages) {
            return res.status(400).json({
                success: false,
                message: `Page ${page} exceeds total number of pages ${totalPages}`
            });
        }

        // Find the student again and populate the complaints array with pagination
        const wardenWithComplaints = await Warden.findById(userId).populate({
            path: 'complaints',
            options: {
                sort: { created_at: -1 },
                skip,
                limit
            }
        });

        res.status(200).json({
            success: true,
            complaints: wardenWithComplaints.complaints,
            totalPages,
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
};



const searchPosts = async (req, res) => {
    try {
        const { source, destination, date } = req.body;

        // Check if all required parameters are provided
        if (!source || !destination || !date) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: source, destination, date'
            });
        }

        // Find posts that match all three criteria
        const posts = await Post.find({ 
            source: source,
            destination: destination,
            date: new Date(date)
        });

        if(posts.length === 0){
            return res.status(404).json({
                success: false,
                message: 'No posts found'
            });
        }

        res.status(200).json({
            success: true,
            posts
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


export { createComplaint, deletePostByIdByStudent, updateComplaintStatusById, getAllComplaintOfStudent, getAllComplaintOfWarden};