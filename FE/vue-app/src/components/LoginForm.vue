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
import {reactive, computed} from 'vue';
import {useUserStore} from "../stores/UserStore";

const userStore = useUserStore();

const model = reactive({
	user: {
		email: "",
		password: ""
	},
	error: false,
	errorMessage: ""
})

const formValid = computed(() => {
	return model.user.email !== ""
})

const handleSubmit = async () => {
	if (formValid.value) {
		const user = {email: model.user.email, password: model.user.password}
		userStore.loginUser(user)

	} else {
		model.error = true,
			model.errorMessage = "Något fält är fel"
	}
}
</script>

<style scoped lang="scss">
.row {
	min-height: 70vh;
}
</style>