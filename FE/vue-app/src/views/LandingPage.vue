<template>
	<main>
		<LoginForm v-if="!register" />
	</main>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import LoginForm from "../components/LoginForm";
	import { useUserStore } from "@/stores/UserStore";
	import router from "../router/index";

	const userStore = useUserStore()

	onMounted(() => {
		if (userStore.sessionExists) {
			router.push('home')
		}
	})

	const register = ref(false);

</script>