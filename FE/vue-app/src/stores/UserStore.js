import axios from "axios";
import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import {
	getLocalStorageItem,
	updateLocalStorageItem,
	removeLocalStorageItem,
	setLocalStorageItem
} from "@/helpers/localStorage";
import { useStorage } from '@vueuse/core'
import router from "../router/index";

export const useUserStore = defineStore("user", () => {
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
				"http://localhost:8000/login",
				user,
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);

			model.user = response.data.user;
			model.sessionExpiration.expires = response.data.expires;
			//localStorage.setItem('user', response.data.user)
			//localStorage.setItem('sessionExpiration', response.data.expires)
			router.push({ path: "/schedules" })
		} catch (error) {
			// TODO: Error handling
			console.log(error);
		}
	};

	const updatePassword = async (currentPassword, newPassword) => {
		try {
			const response = await axios.patch("http://localhost:8000/update-password", {
				currentPassword,
				newPassword
			}, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			})

			const data = response.data;
			if (data) {
				return data.success;
			}
		} catch (error) {
			console.log(error)
		}
	}

	const logoutUser = async () => {
		try {
			const response = await axios.post("http://localhost:8000/logout", {},{
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

				router.push({ path: "/login" })
			}
		} catch (error) {
			console.log(error)
		}

	}

	return { model, sessionExists, loginUser, updatePassword, logoutUser };
});
