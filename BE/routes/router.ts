import { Router } from "express";
import cors, { CorsOptions } from "cors";
import {
    authorizeUser,
    loginUser,
    registerUser,
} from "../controllers/user.controller";
import {
    createSchedule,
    deleteSchedule,
    updateSchedule,
    getAllSchedules,
    getSchedule,
} from "../controllers/schedule.controller";
import {
    getAllCourses,
    getAllCoursesAccociatedWithSchedule,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
} from "../controllers/course.controller";

const router = Router();
// Configure cors options allowed origins
const corsOptions: CorsOptions = {
    origin: ["http://localhost:3000", "http://localhost:8081"],
    credentials: true,
};

router.use(cors(corsOptions));

// ROUTES
// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Schedule routes
router.get("/schedules", authorizeUser, getAllSchedules);
router.get("/schedule/:scheduleId", authorizeUser, getSchedule);
router.post("/create-schedule", authorizeUser, createSchedule);
router.patch("/update-schedule/:scheduleId", authorizeUser, updateSchedule);
router.delete("/delete-schedule/:scheduleId", authorizeUser, deleteSchedule);

//Course routes
router.get("/courses", authorizeUser, getAllCourses);
router.get(
    "/schedule/courses/:scheduleId",
    authorizeUser,
    getAllCoursesAccociatedWithSchedule
);
router.get("/course/:courseId", authorizeUser, getCourse);
router.post("/create-course", authorizeUser, createCourse);
router.patch("/update-course/:courseId", authorizeUser, updateCourse);
router.delete("/delete-course/:courseId", authorizeUser, deleteCourse);

export default router;
