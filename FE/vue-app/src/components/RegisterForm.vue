<template>
	<div class="row gx-0 p-3 text-dark d-flex justify-content-center align-items-center">
		<form>
			<div class="col-12 col-md-4 offset-md-4">
				<div class="mb-5">
					<label for="register-name-input" class="form-label w-100 text-start">
						Name
					</label>
					<input
						type="text"
						class="form-control"
						id="register-name-input"
						v-model="model.user.name"/>
				</div>
				<div class="mb-5">
					<label for="register-email-input" class="form-label w-100 text-start">
						E-mail
					</label>
					<input
						type="email"
						class="form-control"
						id="register-email-input"
						v-model="model.user.email"/>
				</div>
				<div class="mb-5">
					<label for="register-password-input" class="form-label w-100 text-start">
						Password
					</label>
					<input
						type="password"
						class="form-control"
						id="register-password-input"
						v-model="model.user.password"/>
				</div>
				<div class="mb-5">
					<label for="register-repeat-password-input" class="form-label w-100 text-start">
						Repeat password
					</label>
					<input
						type="password"
						:class="['form-control', { 'is-invalid': repeatPasswordValid === false }]"
						id="register-repeat-password-input"
						v-model="model.repeatPassword"
						@blur="repeatPasswordValid = validation.passwordsMatch.value"/>
					<div v-if="repeatPasswordValid === false" class="invalid-feedback text-16 text-start">
						Passwords must match
					</div>
				</div>
				<button type="button" class="btn btn-primary w-50 mt-4" :disabled="!validation.formValid.value" @click="handleSubmit">
					Register
				</button>
			</div>
		</form>
	</div>
</template>

<script setup>
	import { computed, reactive, ref, defineEmits } from "vue"
	import { useUserStore} from "@/stores/UserStore"
	import { useNotification } from "@kyvg/vue3-notification";

	const userStore = useUserStore()
	const { notify } = useNotification();
	const emit = defineEmits(['created'])

	const model = reactive({
		user: {
			email: "",
			name: "",
			password: "",
			isAdmin: false
		},
		repeatPassword: ""
	})

	const repeatPasswordValid = ref(null)

	const validation = {
		formValid: computed(() => {
			return model.user.name !== ""
				&& model.user.email !== ""
				&& validation.passwordComplexityAcceptable.value
				&& validation.passwordsMatch.value
		}),
		passwordComplexityAcceptable: computed(() => {
			return validation.passwordHasEnoughCharacters.value
				&& validation.passwordContainsSpecialCharacter.value
				&& validation.passwordContainsNumber.value
				&& validation.passwordContainsLowercaseLetter.value
				&& validation.passwordContainsUppercaseLetter.value
		}),
		passwordHasEnoughCharacters: computed(() => {
			if (!model.user.password) return false
			return model.user.password.length >= 8
		}),
		passwordContainsSpecialCharacter: computed(() => {
			if (!model.user.password) return false
			//eslint-disable-next-line
			const regex = /[ !@#¤$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g
			return regex.test(model.user.password)
		}),
		passwordContainsNumber: computed(() => {
			if (!model.user.password) return false
			return /\d/.test(model.user.password)
		}),
		passwordContainsUppercaseLetter: computed(() => {
			if (!model.user.password) return false
			return (/[A-Z]/.test(model.user.password))
		}),
		passwordContainsLowercaseLetter: computed(() => {
			if (!model.user.password) return false
			return (/[a-z]/.test(model.user.password))
		}),
		passwordsMatch: computed(() => {
			return model.user.password === model.repeatPassword && model.user.password !== ""
		})
	}

	const handleSubmit = async () => {
		if (validation.formValid.value) {
			const registered = await userStore.registerUser(model.user)

			if (registered.success) {
				notify({
					title: "User successfully updated",
					type: "success",
					duration: 3000
				})
				emit('created')
			} else {
				if (registered.status && registered.status === 500) {
					notify({
						title: "User already exists",
						text: "Please login",
						type: "error",
						duration: 6000
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.row {
		min-height: 70vh;
	}
</style>
