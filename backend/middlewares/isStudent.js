//write a middleware to check if the user is a student

const isStudent = async (req, res, next) => {
    try{
        if(req.user.role !== 'student'){
            return res.status(401).json({message: 'Access denied, you are not a student'});
        }
        next();
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export default isStudent;
