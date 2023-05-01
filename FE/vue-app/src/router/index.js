import { createRouter, createWebHistory } from "vue-router"
import HomePage from "../views/HomePage"
import LandingPage from "../views/LandingPage"
import ProfilePage from "../views/ProfilePage"
import SchedulesPage from "../views/SchedulesPage"
import EditSchedulePage from "../views/EditSchedulePage"
import {useUserStore} from "@/stores/UserStore"
import CoursesPage from "@/views/CoursesPage.vue"
import EditCoursePage from "@/views/EditCoursePage.vue"
import AdminDashboardPage from "@/views/AdminDashboardPage.vue"
import EditUserPage from "@/views/EditUserPage.vue";

const routes = [
	{
		path: "/",
		name: "home",
		component: HomePage,
	},
	{
		path: "/login",
		name: "login",
		component: LandingPage,
	},
	{
		path: "/profile",
		name: "profile",
		component: ProfilePage,
	},
	{
		path: "/schedules",
		name: "schedules",
		component: SchedulesPage,
	},
	{
		path: "/edit-schedule/:id",
		name: "edit-schedule",
		component: EditSchedulePage,
	},
	{
		path: "/courses",
		name: "courses",
		component: CoursesPage
	},
	{
		path: "/edit-course/:id",
		name: "edit-course",
		component: EditCoursePage
	},
	{
		path: "/admin-dashboard",
		name: "admin-dashboard",
		component: AdminDashboardPage
	},
	{
		path: "/admin-dashboard/update-user/:id",
		name: "admin-dashboard-update-user",
		component: EditUserPage
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach((to, from) => {
	const userStore = useUserStore()
	const sessionExists = userStore.sessionExists
	const isAdmin = userStore.isAdmin
	//to.path !== "/login" && next()
	if (to.path !== "/login" && !sessionExists) {
		router.push({ path: "/login" })
	} else if (to.path === "/login" && sessionExists) {
		router.push({ path: "/schedules" })
	} else if ((to.path === "/admin-dashboard" || to.name === "admin-dashboard-update-user") && !isAdmin) {
		router.push({ path: "/profile" })
	}
})

export default router;
