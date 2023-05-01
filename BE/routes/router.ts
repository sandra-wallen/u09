import { Router } from "express";
import cors, { CorsOptions } from "cors";
import {
    authUser, authAdmin, getUser,
    loginUser, deleteUser, logoutUser,
    registerUser,
    updatePassword, updateUser
} from "../controllers/user.controller";
import { adminGetUsers, adminGetUser, adminUpdateUser, adminUpdateUserPassword, adminDeleteUser } from "../controllers/admin.controller";
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
    origin: ["http://localhost:3000", "http://localhost:8081", "https://u09-fe.onrender.com"],
    credentials: true,
};

router.use(cors(corsOptions));

// ROUTES
// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// User routes
router.get("/user", authUser, getUser);
router.patch("/update-user", authUser, updateUser);
router.patch("/update-password", authUser, updatePassword);
router.delete("/delete-user", authUser, deleteUser);
router.post("/logout", authUser, logoutUser);

// Admin routes
router.get("/admin/users", authUser, authAdmin, adminGetUsers);
router.get("/admin/user/:userId", authUser, authAdmin, adminGetUser);
router.patch("/admin/update-user/:userId", authUser, authAdmin, adminUpdateUser);
router.patch("/admin/update-user-password/:userId", authUser, authAdmin, adminUpdateUserPassword);
router.delete("/admin/delete-user/:userId", authUser, authAdmin, adminDeleteUser);

// Schedule routes
router.get("/schedules", authUser, getAllSchedules);
router.get("/schedule/:scheduleId", authUser, getSchedule);
router.post("/create-schedule", authUser, createSchedule);
router.patch("/update-schedule/:scheduleId", authUser, updateSchedule);
router.delete("/delete-schedule/:scheduleId", authUser, deleteSchedule);

//Course routes
router.get("/courses", authUser, getAllCourses);
router.get("/schedule/courses/:scheduleId", authUser, getAllCoursesAccociatedWithSchedule);
router.get("/course/:courseId", authUser, getCourse);
router.post("/create-course", authUser, createCourse);
router.patch("/update-course/:courseId", authUser, updateCourse);
router.delete("/delete-course/:courseId", authUser, deleteCourse);

export default router;
