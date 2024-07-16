//write a middleware to check if the user is a student

const isWarden = async (req, res, next) => {
    try{
        if(req.user.role !== 'warden'){
            return res.status(401).json({message: 'Access denied, you are not a warden'});
        }
        next();
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export default isWarden;
