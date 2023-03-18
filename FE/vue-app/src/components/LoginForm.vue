<template>
	<div class="container-sm w-50 p-3 bg-light text-dark">
            <form>
                <div class="mb-3">
                    <label for="emailInput" class="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        class="form-control"
                        id="emailInput"
                        v-model="model.user.email"/>
                    <div id="emailHelp" class="form-text">
                        We'll never share your email with anyone else.
                    </div>
                </div>
                <div class="mb-3">
                    <label for="passwordInput" class="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        class="form-control"
                        id="passwordInput"
                        v-model="model.user.password"/>
                </div>
                <button type="button" class="btn btn-primary" @click="handleSubmit">
                    Submit
                </button>
            </form>
        </div>
</template>

<script setup>
	import { reactive, computed } from 'vue';
	import { useUserStore } from "../stores/UserStore";

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
			const user = { email: model.user.email, password: model.user.password }
			userStore.loginUser(user)

		} else {
			model.error = true,
			model.errorMessage = "Något fält är fel"
		}
	}
</script>