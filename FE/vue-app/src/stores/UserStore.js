import axios from "axios";
import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import {
	getLocalStorageItem,
	updateLocalStorageItem,
	removeLocalStorageItem,
	setLocalStorageItem
} from "@/helpers/localStorage";
import router from "../router/index";

const localStorage = {
	getItem: (key) => getLocalStorageItem(key),
	setItem: (key, value) => setLocalStorageItem(key, value),
	updateItem: (key, value) => updateLocalStorageItem(key, value),
	removeItem: (key, value) => removeLocalStorageItem(key, value)
}

export const useUserStore = defineStore("user", () => {
	const model = reactive({
		user: {
			_id: "",
			email: "",
			name: "",
		},
		sessionExpiration: null,
	});

	const sessionExists = () => {
		return localStorage.getItem('sessionExpiration') ?
			new Date(localStorage.getItem('sessionExpiration')) > new Date()
			: false;
	};

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
			model.sessionExpiration = response.data.expires;
			localStorage.setItem('user', response.data.user)
			localStorage.setItem('sessionExpiration', response.data.expires)
			router.push({ path: "/schedules" })
		} catch (error) {
			// TODO: Error handling
			console.log(error);
		}
	};

	const logoutUser = async () => {
		model.user._id = "";
		model.user.email = "";
		model.user.name = "";
		model.sessionExpiration = null;
		localStorage.removeItem('user')
		localStorage.removeItem('sessionExpiration')
	}

	return { model, sessionExists, loginUser, logoutUser };
});
