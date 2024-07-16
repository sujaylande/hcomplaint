import express from 'express';
import isAuthenticated  from '../middlewares/isAuth.js';
import isStudent from '../middlewares/isStudent.js';
import  {createComplaint, deletePostByIdByStudent, getAllComplaintOfStudent, getAllComplaintOfWarden, updateComplaintStatusById}  from '../controllers/complaint.js';
import isWarden from '../middlewares/isWarden.js';

const router = express.Router();

router.route('/create-complaint').post(isAuthenticated, isStudent, createComplaint);

router.route('/delete-complaint-bystudent/:id').delete(isAuthenticated, isStudent, deletePostByIdByStudent);

router.route('/update-complaint-bywarden/:id').get(isAuthenticated, isWarden, updateComplaintStatusById);

router.route('/get-complaint-ofstudent').get(isAuthenticated, isStudent, getAllComplaintOfStudent);

router.route('/get-complaint-ofwarden').get(isAuthenticated, isWarden, getAllComplaintOfWarden);





export default router;