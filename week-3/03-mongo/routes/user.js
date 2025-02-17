const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course} = require("../db");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({
            username: username
        });

        if (existingUser) {
            res.status(409).json({
                error: 'username already exist'
            });
        }

        const newUser = await User.create({
            username: username,
            password: password
        });

        res.status(201).json({
            message: 'User created successfully'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
    
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    try {
        const courses = await Course.find({published: true});
        res.status(200).json({
            courses: courses
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    try {
        const courseId = req.params;
        const username = req.body.username;

        const result = await User.updateOne(
            { username: username }, // Find user by username
            { $addToSet: { purchasedCourses: courseId } } // Add course to array
        );

        if (result.modifiedCount === 0) {
            console.log("User not found or course already added!");
            return;
        }

        res.status(200).json({
            message: 'Course purchased successfully'
        });

    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }

});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    try {
        const user = await User.findOne({ username })
            .populate('purchasedCourses') // Fetch full course details
            .exec(); // Ensures a Promise is returned

        if (!user) {
            res.status(409).json({
                error: 'Error no user exist'
            });
        }

        res.status(200).json({
            purchasedCourses: user.purchasedCourses
        })
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

module.exports = router