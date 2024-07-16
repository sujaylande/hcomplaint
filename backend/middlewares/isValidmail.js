

const validateEmail = (req, res, next) => {
    const email = req.body.email;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.in$/;

    if (!emailPattern.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email. Only students with the email @nitk.edu.in can register.'
        });
    }

    next();
};

export default validateEmail;
