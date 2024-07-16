import { Student } from '../models/Student.js';
import { Warden } from '../models/Warden.js';

const studentRegister = async (req, res) => {

    try {
        const { name, roll_no, email, password, phone, block_no, room_no  } = req.body;

        let user = await Student.findOne({ email });

        //if user already exists redirect to login page
        if (user) {
            return res
                .status(200)
                .json({
                    success: true,
                    message: 'User already exists! Please login'
                });
        }

        user = await Student.create({ //create new user
            name, roll_no, email, password, phone, block_no, room_no
        });

        //regiser plus login both at same time
        const token = await user.generateToken();

        res.status(201).cookie("token", token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days
            httpOnly: true
        }).json({
            success: true,
            user,
            token
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const wardenRegister = async (req, res) => {

    try {
        const { name, emp_no, email, password, phone, block_no } = req.body;

        let user = await Warden.findOne({ email });

        //if user already exists redirect to login page
        if (user) {
            return res
                .status(200)
                .json({
                    success: true,
                    message: 'User already exists! Please login'
                });
        }

        user = await Warden.create({ //create new user
            name, emp_no, email, password, phone, block_no
        });

        //regiser plus login both at same time
        const token = await user.generateToken();

        res.status(201).cookie("token", token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days
            httpOnly: true
        }).json({
            success: true,
            user,
            token
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        //models mde select false kela hota so select true karayla lagto password sathi
        let user = await Student.findOne({ email }).select('+password');
        const user1 = await Warden.findOne({ email }).select('+password');

        if (!user && !user1) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'User not found!'
                });
        }

        if(user1){
            user = user1;
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'Incorrect password'
                });
        }

        const token = await user.generateToken();

        res.status(201).cookie("token", token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days
            httpOnly: true
        }).json({
            success: true,
            user,
            token
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const logout = async (req, res) => {

    try {
        res.cookie("token", "", { //set token to empty string
            expires: new Date(Date.now()), 
            httpOnly: true
        }).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


const myProfile = async (req, res) => {

    try{
        let user = await Student.findById(req.user._id);
        const user1 = await Warden.findById(req.user._id);

        if(user1){
            user = user1;
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch(error){
        res.status(500).json({
            success: false,
            massage: error.message,
        });
    }
}


export { studentRegister, wardenRegister, login, logout, myProfile };
