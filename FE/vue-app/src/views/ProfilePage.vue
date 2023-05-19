<template>
	<main class="mb-3 px-5">
		<div class="row gx-0">
			<div v-if="!confirmDeleteUser" class="col-12 d-flex justify-content-end">
				<button class="btn btn-danger"
						type="button"
						@click="confirmDeleteUser = true"
						:disabled="offline">Delete account</button>
			</div>
			<div v-if="confirmDeleteUser" class="col-12 d-flex justify-content-end">
				<p class="text-18 align-self-center mb-0 me-3">Are you sure?</p>
				<button class="btn btn-secondary" type="button" @click="confirmDeleteUser = false">Cancel</button>
				<button class="btn btn-danger" type="button" @click="deleteUser">Delete</button>
			</div>
			<div class="col-12 mb-5">
				<h1 class="text-start">Hello {{ userStore.model.user.name }}</h1>
			</div>
			<div class="col-12 col-md-6 text-start">
				<h3 class="mb-4">Information about you</h3>
				<div class="row gx-0 mb-4">
					<div class="col-12">
						<label for="profile-page-name-input" class="form-label">Name</label>
					</div>
					<div class="col-8">
						<input id="profile-page-name-input"
							   type="text"
							   class="form-control"
							   v-model="userStore.model.user.name">
					</div>
					<div class="col-3 ms-3">
						<button type="button"
								class="btn btn-primary save-btn"
								@click="updateUser"
								:disabled="offline">Save</button>
					</div>
				</div>
				<div class="mb-4">
					<p class="form-label">E-mail</p>
					<p class="text-16">{{ userStore.model.user.email }}</p>
				</div>
				<div class="row gx-0 py-4">
					<div v-show="!changePassword" class="col-12">
						<button type="button"
								class="btn btn-secondary"
								@click="changePassword = true"
								:disabled="offline">
							Change password
						</button>
					</div>
					<form v-show="changePassword" class="col-12">
						<div class="mb-4">
							<input id="hidden-profile-page-update-password-input" type="text"
								   v-model="userStore.model.user.email" style="display: none"/>
							<label for="profile-page-current-password-input" class="form-label">Current password</label>
							<input id="profile-page-current-password-input" type="password" class="form-control"
								   v-model="model.user.currentPassword" autocomplete="current-password">
						</div>
						<div class="mb-4">
							<label for="profile-page-new-password-input" class="form-label">New password</label>
							<input id="profile-page-new-password-input" type="password" class="form-control"
								   v-model="model.user.newPassword" autocomplete="new-password">
						</div>
						<div class="mb-4">
							<label for="profile-page-repeat-new-password-input" class="form-label">Repeat
								password</label>
							<input id="profile-page-repeat-new-password-input" type="password" class="form-control"
								   v-model="model.user.repeatNewPassword" autocomplete="new-password">
						</div>
						<div>
							<button type="button" class="btn btn-primary w-50" :disabled="!validation.formValid.value"
									@click="savePassword">Save
							</button>
						</div>
					</form>
				</div>
			</div>
			<div class="col-12 col-md-6 text-start">
				<h3 class="mb-4">You currently have</h3>
				<ul>
					<li class="text-16">{{ schedulesStore.model.schedules?.length }} schedules</li>
					<li class="text-16">{{ coursesStore.model.courses?.length }} courses</li>
				</ul>
			</div>
		</div>
	</main>
</template>
<script setup>
	import { ref, reactive, computed, onMounted } from "vue"
	import { useUserStore } from "@/stores/UserStore"
	import { useSchedulesStore } from "@/stores/SchedulesStore"
	import { useCoursesStore } from "@/stores/CoursesStore"
	import { useNotification } from "@kyvg/vue3-notification"
	import { useRouter } from "vue-router"

	const schedulesStore = useSchedulesStore()
	const coursesStore = useCoursesStore()
	const userStore = useUserStore()
	const { notify } = useNotification()
	const router = useRouter()

	const offline = ref(false)

	const model = reactive({
		user: {
			currentPassword: "",
			newPassword: "",
			repeatNewPassword: ""
		}
	})

	onMounted(async () => {
		const user = await userStore.getUser()

		if (!user.success) {
			notify({
				title: "Your information couldn't be fetched",
				text: "Please try reloading the page",
				type: "error",
				duration: 6000,
			})
		} else if (user.success && user.offline) {
			notify({
				title: "You are currently offline",
				text: "Your information have been loaded from cache, functionality is limited",
				duration: 6000,
			})
		}

		offline.value = user.offline

		await schedulesStore.getSchedules()
		await coursesStore.getCourses()
	})

	const changePassword = ref(false)
	const confirmDeleteUser = ref(false)

	const validation = {
		formValid: computed(() => {
			return model.user.currentPassword !== ""
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
			if (!model.user.newPassword) return false
			return model.user.newPassword.length >= 8
		}),
		passwordContainsSpecialCharacter: computed(() => {
			if (!model.user.newPassword) return false
			//eslint-disable-next-line
			const regex = /[ !@#¤$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g
			return regex.test(model.user.newPassword)
		}),
		passwordContainsNumber: computed(() => {
			if (!model.user.newPassword) return false
			return /\d/.test(model.user.newPassword)
		}),
		passwordContainsUppercaseLetter: computed(() => {
			if (!model.user.newPassword) return false
			return (/[A-Z]/.test(model.user.newPassword))
		}),
		passwordContainsLowercaseLetter: computed(() => {
			if (!model.user.newPassword) return false
			return (/[a-z]/.test(model.user.newPassword))
		}),
		passwordsMatch: computed(() => {
			return model.user.newPassword === model.user.repeatNewPassword && model.user.newPassword !== ""
		})
	}

	const updateUser = async () => {
		const userInfo = { name: userStore.model.user.name }
		const updatedUser = await userStore.updateUser(userInfo)

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

	const savePassword = async () => {
		if (validation.formValid) {
			const updatedPassword = await userStore.updatePassword(model.user.currentPassword, model.user.newPassword)
			if (updatedPassword.success) {
				model.user.currentPassword = ""
				model.user.newPassword = ""
				model.user.repeatNewPassword = ""
				changePassword.value = false

				notify({
					title: "Password successfully updated",
					type: "success",
					duration: 3000
				})

			} else {
				if (updatedPassword.status) {
					const config = {
						title: updatedPassword.status === 401 ? "Invalid current password"
							: updatedPassword.status === 404 ? "Could not update password"
								: "Something went wrong",
						text: updatedPassword.status === 401 ? "Please enter your current password and try again"
							: "Please try again",
						type: "error",
						duration: 6000
					}
					notify(config)
				}
			}
		}
	}

	const deleteUser = async () => {
		const deletedUser = await userStore.deleteUser()

		if (deletedUser.success) {
			userStore.clearState()
			schedulesStore.clearState()
			coursesStore.clearState()
			router.push("/login")
		} else {
			notify({
				title: "User could not be deleted",
				text: "Please try again",
				type: "error",
				duration: 6000
			})
		}
	}

</script>
<style scoped lang="scss">
	.save-btn {
		padding: 0.5rem 1.4rem;
	}
</style>
