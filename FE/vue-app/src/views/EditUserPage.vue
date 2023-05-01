<template>
	<main>
		<div class="row gx-2 my-4 schedule-wrapper justify-content-start">
			<div class="col-12 mb-2">
				<BackLink />
			</div>
			<div class="col-12 mb-4">
				<h1 class="text-start">Edit user</h1>
			</div>
			<div class="col-12 col-md-6 p-2 pe-5">
				<form class="text-start">
					<div class="row gx-0 gy-4 py-3">
						<div class="col-12">
							<label
								for="admin-edit-user-name-input"
								class="form-label">
								Name
							</label>
							<input
								type="text"
								id="admin-edit-user-name-input"
								class="form-control"
								placeholder="E-mail"
								v-model="adminStore.model.user.name"/>
						</div>
						<div class="col-12">
							<label
								for="admin-edit-user-email-input"
								class="form-label">
								E-mail
							</label>
							<input
								type="text"
								id="admin-edit-user-email-input"
								class="form-control"
								placeholder="E-mail"
								v-model="adminStore.model.user.email"/>
						</div>
						<div class="col-12">
							<div class="form-check">
								<input id="admin-update-user-admin-input"
									   class="form-check-input me-3"
									   type="checkbox"
									   v-model="adminStore.model.user.isAdmin"/>
								<label for="admin-update-user-admin-input" class="form-check-label">
									Admin user
								</label>
							</div>
						</div>
						<div>
							<button type="button" class="btn btn-primary w-50"
									:disabled="!validation.userInfoFormValid.value" @click="updateUserInfo">
								Save
							</button>
						</div>
					</div>
				</form>
			</div>
			<div class="col-12 col-md-6 p-2 pe-5">
				<form class="text-start">
					<div class="row gx-0 gy-4 py-3">
						<div v-show="!changePassword" class="col-12">
							<button type="button" class="btn btn-secondary" @click="changePassword = true">
								Change password
							</button>
						</div>
						<div v-show="changePassword" class="col-12">
							<div class="mb-4">
								<input id="hidden-admin-update-password-input" type="text"
									   v-model="adminStore.model.user.email" style="display: none"/>
								<label for="admin-update-user-password-input" class="form-label">New password</label>
								<input id="admin-update-user-password-input" type="password" class="form-control"
									   v-model="model.user.password"/>
							</div>
							<div class="mb-4">
								<label for="admin-update-user-repeat-password-input" class="form-label">Repeat
									password</label>
								<input id="admin-update-user-repeat-password-input" type="password" class="form-control"
									   v-model="model.user.repeatPassword" autocomplete="new-password">
							</div>
							<button type="button" class="btn btn-primary w-50"
									:disabled="!validation.passwordFormValid.value" @click="updatePassword">Save
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</main>
</template>

<script setup>
import {computed, onMounted, reactive, ref, onUpdated} from "vue"
import {useAdminStore} from "@/stores/AdminStore"
import {useNotification} from "@kyvg/vue3-notification"
import {useRoute} from "vue-router"
import BackLink from "@/components/BackLink.vue";

const adminStore = useAdminStore()
const {notify} = useNotification()
const route = useRoute()

const id = route.params.id

const model = reactive({
	user: {
		password: "",
		repeatPassword: ""
	}
})

onMounted(() => {
	adminStore.getUser(id)
})

const changePassword = ref(false)

const validation = {
	userInfoFormValid: computed(() => {
		return adminStore.model.user.name !== ""
			&& adminStore.model.user.email !== ""
			&& adminStore.model.user.isAdmin !== null
	}),
	passwordFormValid: computed(() => {
		return model.user.password !== ""
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
		return model.user.password === model.user.repeatPassword && model.user.password !== ""
	})
}

const updatePassword = async () => {
	if (validation.passwordFormValid) {
		const updatedPassword = await adminStore.updateUserPassword(id, model.user.password)
		if (updatedPassword.success) {
			model.user.password = ""
			model.user.repeatPassword = ""
			changePassword.value = false

			notify({
				title: "Password successfully updated",
				type: "success",
				duration: 3000
			})
		} else {
			notify({
				title: "Could not update password",
				text: "Please try again",
				type: "error",
				duration: 6000
			})
		}
	}
}

const updateUserInfo = async () => {
	if (validation.userInfoFormValid) {
		const user = {
			name: adminStore.model.user.name,
			email: adminStore.model.user.email,
			isAdmin: adminStore.model.user.isAdmin
		}
		const updatedUser = await adminStore.updateUser(id, user)

		if (updatedUser.success) {
			notify({
				title: "User successfully updated",
				type: "success",
				duration: 3000
			})
		} else {
			notify({
				title: "User could not be updated",
				text: "Please try again",
				type: "error",
				duration: 6000
			})
		}
	}
}
</script>

<style scoped lang="scss">

</style>