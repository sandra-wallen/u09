<template>
	<main>
		<LoginForm v-if="!register" />
	</main>
</template>

<script setup>
	import { ref } from "vue";
	import LoginForm from "../components/LoginForm";

	const register = ref(false);

</script>