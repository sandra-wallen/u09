import { defineStore } from "pinia";
import { reactive, computed } from "vue";

export const useUserStore = defineStore("user", () => {
	const model = reactive({
		user: {
			_id: "",
			email: "",
			name: "",
		},
		sessionExpiration: null,
	});

	const sessionExists = computed(
		() => new Date(model.sessionExpiration) > new Date()
	);

	const loginUser = async (user) => {
		try {
			const response = await fetch("http://localhost:8000/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			});

			if (response.success) {
				const data = await response.json();
				model.user = data.user;
				model.sessionExpiration = data.expires;
			}
		} catch (error) {
			console.log(error);
		}
	};

	return { model, sessionExists, loginUser };
});
