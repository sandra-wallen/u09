import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage";
import LandingPage from "../views/LandingPage";
import ProfilePage from "../views/ProfilePage";
import SchedulesPage from "../views/SchedulesPage";
import EditSchedulePage from "../views/EditSchedulePage";
import {useUserStore} from "@/stores/UserStore";
import CoursesPage from "@/views/CoursesPage.vue";

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
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach((to, from) => {
	const userStore = useUserStore()
	const sessionExists = userStore.sessionExists
	//to.path !== "/login" && next()
	if (to.path !== "/login" && !sessionExists) {
		router.push({ path: "/login" })
	} else if (to.path === "/login" && sessionExists) {
		router.push({ path: "/schedules" })
	}
})

export default router;
