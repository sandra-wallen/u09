import axios from "axios"
import { defineStore } from "pinia"
import { reactive } from "vue"
import Localbase from "localbase"

export const useAdminStore = defineStore("admin", () => {
	const indexedDb = new Localbase('adminStore')
	const baseUrl = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : "http://localhost:8000"

	const model = reactive({
		users: [],
		user: {}
	})
	const getUsers = async () => {
		if (navigator.onLine) {
			try {
				const response = await axios.get(`${baseUrl}/admin/users`, {
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				})

				if (response.data.success) {
					model.users = response.data.users
					indexedDb.collection('users').set(response.data.users)
				}

				return { ...response.data, offline: false }

			} catch (error) {
				return { success: false, offline: false }
			}
		} else {
			indexedDb.collection('users').get().then(users => {
				model.users = users
			})
			return { success: true, offline: true }
		}
	}

	const getUser = async (userId) => {
		try {
			const response = await axios.get(`${baseUrl}/admin/user/${userId}`, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			})

			if (response.data.success) {
				model.user = response.data.user
			}
			return response.data
		} catch (error) {
			return { success: false }
		}
	}

	// Used to update user information excluding password
	const updateUser = async (userId, user) => {
		try {
			const response = await axios.patch(`${baseUrl}/admin/update-user/${userId}`, {
					user
				},
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				})

			return response.data
		} catch (error) {
			return { success: false }
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
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				})

			return response.data
		} catch (error) {
			return { success: false }
		}
	}

	const deleteUser = async (userId) => {
		try {
			const response = await axios.delete(`${baseUrl}/admin/delete-user/${userId}`, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			})

			return response.data
		} catch (error) {
			return { success: false }
		}
	}

	return { model, getUsers, getUser, updateUser, updateUserPassword, deleteUser }
})