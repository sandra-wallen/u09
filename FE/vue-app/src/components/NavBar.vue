<template>
    <nav class="navbar navbar-expand-lg p-5 text-20">
        <div class="container-fluid">
            <a class="navbar-brand text-22 me-5" href="#">
                App name
            </a>

			<!--	Hamburger menu, small devices		-->
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div
                class="collapse navbar-collapse"
                id="navbarSupportedContent">
                <ul v-if="userStore.sessionExists" class="navbar-nav my-5 my-lg-0">
                    <li class="nav-item">
                        <RouterLink
                            to="/profile"
                            :class="['nav-link me-3', { 'text-underline fw-500': routeName === 'profile'}]">
                            Profile
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink
                            to="/schedules"
							:class="['nav-link me-3', { 'text-underline fw-500': routeName === 'schedules' || routeName === 'edit-schedule'}]">
                            My schedules
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink
                            to="/courses"
							:class="['nav-link me-3', { 'text-underline fw-500': routeName === 'courses'}]">
                            Courses
                        </RouterLink>
                    </li>
                </ul>
                <button v-if="userStore.sessionExists"
                    class="btn btn-secondary ms-auto"
                    type="button"
					@click="userStore.logoutUser()">
                    Logout
                </button>
				<button v-if="!userStore.sessionExists"
					class="btn btn-primary ms-auto"
					type="button"
					@click="router.push({ path: '/login' })">
					Login
				</button>
            </div>
        </div>
    </nav>
</template>
<script setup>
	import { computed, onUpdated } from "vue";
	import { useUserStore} from "@/stores/UserStore";
	import router from "@/router/index";
	import { useRoute } from "vue-router";

	const userStore = useUserStore();

	const routeName = computed(() => useRoute().name)
</script>
<style lang="scss">
	@import "@/styles/index";

	.navbar {
		background-color: $light-rose;
	}
</style>