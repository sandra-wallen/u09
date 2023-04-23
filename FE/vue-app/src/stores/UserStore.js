import axios from "axios";
import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore("user", () => {
	const baseUrl = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : "http://localhost:8000"

	const model = reactive({
		user: useStorage('user', {
			_id: "",
			email: "",
			name: ""
		}),
		sessionExpiration: useStorage('sessionExpiration', {
			expires: null
		})
	});

	const sessionExists = computed(() => {
		return new Date(model.sessionExpiration.expires) > new Date()
	});

	const loginUser = async (user) => {
		try {
			const response = await axios.post(
				`${baseUrl}/login`,
				user,
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)

			if (response.data.success) {
				model.user = response.data.user
				model.sessionExpiration.expires = response.data.expires
			}
			return response.data

		} catch (error) {
			return { success: false, status: error.response.status }
		}
	}

	const registerUser = async (user) => {
		try {
			const response = await axios.post(`${baseUrl}/register`,
				user,
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)
			console.log(response)
			return response.data
		} catch (error) {
			console.log(error)
			return { success: false, status: error.response.status }
		}
	}

	const getUser = async () => {
		try {
			const response = await axios.get(`${baseUrl}/user`,
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
			if (response.data.success) {
				model.user = response.data.user;
			}
			return response.data

		} catch (error) {
			return { success: false }
		}
	}

	const updateUser = async (userInfo) => {
		try {
			const response = await axios.patch(`${baseUrl}/update-user`, {
					user: userInfo
				},
			{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)
			if (response.data.success) {
				model.user = response.data.user;
			}
			return response.data;

		} catch (error) {
			return { success: false }
		}
	}

	const updatePassword = async (currentPassword, newPassword) => {
		try {
			const response = await axios.patch(`${baseUrl}/update-password`, {
				currentPassword,
				newPassword
			}, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			})
			return response.data;

		} catch (error) {
			return { success: false, status: error.response.status };
		}
	}

	const logoutUser = async () => {
		try {
			const response = await axios.post(`${baseUrl}/logout`, {},{
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			})

			const data = response.data;
			if (data.success) {
				model.user = {
					_id: "",
					email: "",
					name: ""
				}

				model.sessionExpiration.expires = null;

				return response.data
			}
		} catch (error) {
			return { success: false }
		}

	}

	return { model, sessionExists, loginUser, registerUser, getUser, updateUser, updatePassword, logoutUser };
});
