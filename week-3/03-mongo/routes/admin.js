const {Router} = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, Course } = require('../db')


// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    try {
        const { username, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username });

        if (existingAdmin) {
            return res.status(409).json({ error: 'Admin already exists' });
        }

        // Add new admin
        const newAdmin = new Admin({ username, password });
        const savedAdmin = await newAdmin.save();

        res.status(201).json({ message: 'Admin registered successfully', admin: savedAdmin });
    } catch (error) {
        console.error("Error adding admin:", error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/courses', adminMiddleware, async (req, res) => {

    try {
        const { title, description, price, imageLink } = req.body;
        const newCouse =  await Course.create({
            title: title,
            description: description,
            price: price,
            imageLink: imageLink
        });

        res.status(201).json({
            message: 'Course created successfully',
            courseId: newCouse._id
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic

    try {
        const courses = await Course.find({});
        res.status(200).json({
            courses: courses
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }

});

module.exports = router;