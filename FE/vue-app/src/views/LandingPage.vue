<template>
	<main>
		<LoginForm v-if="!register"/>
		<RegisterForm v-if="register" @created="toggleRegister"/>
		<div>
			<p v-if="!register" class="text-16">Not a member yet?</p>
			<p v-else class="text-16">Already a member?</p>
			<button type="button" class="btn btn-secondary" @click="toggleRegister">
				{{ !register ? "Register" : "Login" }}
			</button>
		</div>
	</main>
</template>

<script setup>
	import { ref } from "vue"
	import LoginForm from "../components/LoginForm"
	import RegisterForm from "@/components/RegisterForm.vue"

	const register = ref(false)

	const toggleRegister = () => {
		register.value = !register.value
	}

</script>

<style scoped lang="scss">
</style>