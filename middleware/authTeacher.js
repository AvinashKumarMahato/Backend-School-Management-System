import jwt from 'jsonwebtoken';

const authTeacher = async (req, res, next) => {
    try {
        // Get token from headers
        const dToken = req.headers.dtoken || req.headers['dtoken'];
        
        if (!dToken) {
            return res.status(401).json({
                success: false,
                message: 'Not Authorized: Login Required'
            });
        }

        // Verify token
        const decoded = jwt.verify(dToken, process.env.JWT_SECRET);
        req.teacherId = decoded.id;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

export default authTeacher;