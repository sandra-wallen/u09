import axios from "axios"
import {defineStore} from "pinia"
import {reactive} from "vue"

export const useAdminStore = defineStore("admin", () => {
	const baseUrl = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : "http://localhost:8000"

	const model = reactive({
		users: [],
		user: {}
	})

	const getUsers = async () => {
		try {
			const response = await axios.get(`${baseUrl}/admin/users`, {
				headers: {"Content-Type": "application/json"},
				withCredentials: true,
			})

			if (response.data.success) {
				model.users = response.data.users
			}
			return response.data

		} catch (error) {
			return {success: false}
		}
	}

	const getUser = async (userId) => {
		try {
			const response = await axios.get(`${baseUrl}/admin/user/${userId}`, {
				headers: {"Content-Type": "application/json"},
				withCredentials: true,
			})

			if (response.data.success) {
				model.user = response.data.user
			}
			return response.data
		} catch (error) {
			return {success: false}
		}
	}

	const updateUser = async (userId, user) => {
		try {
			const response = await axios.patch(`${baseUrl}/admin/update-user/${userId}`, {
					user
				},
				{
					headers: {"Content-Type": "application/json"},
					withCredentials: true,
				})

			return response.data
		} catch (error) {
			return {success: false}
		}
	}

	const updateUserPassword = async (userId, password) => {
		try {
			const response = await axios.patch(`${baseUrl}/admin/update-user-password/${userId}`,
				{
					user: {
						password
					}
				},
				{
					headers: {"Content-Type": "application/json"},
					withCredentials: true,
				})

			return response.data
		} catch (error) {
			return {success: false}
		}
	}

	const deleteUser = async (userId) => {
		try {
			const response = await axios.delete(`${baseUrl}/admin/delete-user/${userId}`, {
				headers: {"Content-Type": "application/json"},
				withCredentials: true,
			})

			return response.data
		} catch (error) {
			return {success: false}
		}
	}

	return {model, getUsers, getUser, updateUser, updateUserPassword, deleteUser}
})