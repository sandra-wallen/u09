<template>
	<div class="row gx-0 p-3 text-dark d-flex justify-content-center align-items-center">
		<form>
			<div class="col-12 col-md-4 offset-md-4">
				<div class="mb-5">
					<label for="emailInput" class="form-label w-100 text-start">
						E-mail
					</label>
					<input
						type="email"
						class="form-control"
						id="emailInput"
						v-model="model.user.email"/>
				</div>
				<div class="mb-5">
					<label for="passwordInput" class="form-label w-100 text-start">
						Password
					</label>
					<input
						type="password"
						class="form-control"
						id="passwordInput"
						v-model="model.user.password"/>
				</div>
				<button type="button" class="btn btn-primary w-50 mt-4" @click="handleSubmit">
					Login
				</button>
			</div>
		</form>
	</div>
</template>

<script setup>
	import { reactive, computed } from 'vue'
	import { useUserStore } from "@/stores/UserStore"
	import { useNotification } from "@kyvg/vue3-notification"
	import router from "@/router"

	const userStore = useUserStore()
	const { notify } = useNotification()

	const model = reactive({
		user: {
			email: "",
			password: ""
		}
	})

	const formValid = computed(() => model.user.email !== "" && model.user.password !== "")

	const handleSubmit = async () => {
		if (formValid.value) {
			const user = { email: model.user.email, password: model.user.password }
			const loggedIn = await userStore.loginUser(user)

			if (loggedIn.success) {
				router.push({ path: "/schedules" })
			} else {
				const config = loggedIn.status === 401 ? {
					title: "Invalid password",
					text: "Please fill out the correct password and try again"
				} : loggedIn.status === 404 ? {
					title: "There is no account registered with this e-mail",
					text: "Register an account to login"
				} : {
					title: "Something went wrong",
					text: "Please try again"
				}

				notify({
					...config,
					type: "error",
					duration: 6000
				})
			}
		} else {
			notify({
				title: "Some field is missing",
				text: "Please fill out both e-mail and password",
				type: "error",
				duration: 6000
			})
		}
	}
</script>

<style scoped lang="scss">
	.row {
		min-height: 70vh;
	}
</style>