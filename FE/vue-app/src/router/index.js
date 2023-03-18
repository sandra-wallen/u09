import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage";
import LandingPage from "../views/LandingPage";
import ProfilePage from "../views/ProfilePage";
import SchedulesPage from "../views/SchedulesPage";

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
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
