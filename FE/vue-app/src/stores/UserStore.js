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

const localStorage = {
	getItem: (key) => getLocalStorageItem(key),
	setItem: (key, value) => setLocalStorageItem(key, value),
	updateItem: (key, value) => updateLocalStorageItem(key, value),
	removeItem: (key, value) => removeLocalStorageItem(key, value)
}

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

	const logoutUser = async () => {
		model.user = {
			_id: "",
			email: "",
			name: ""
		}

		// model.user._id = "";
		// model.user.email = "";
		// model.user.name = "";
		model.sessionExpiration.expires = null;
		// localStorage.removeItem('user')
		// localStorage.removeItem('sessionExpiration')
		router.push({ path: "/login" })
	}

	return { model, sessionExists, loginUser, logoutUser };
});
