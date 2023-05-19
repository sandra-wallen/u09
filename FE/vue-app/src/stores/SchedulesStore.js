import axios from "axios"
import { defineStore } from "pinia"
import { reactive } from "vue"
import { useUserStore } from "@/stores/UserStore"

export const useSchedulesStore = defineStore("schedules", () => {
	const userStore = useUserStore()
	const baseUrl = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : "http://localhost:8000"

	const model = reactive({
		cachedDatabase: null,
		schedules: [],
		schedule: {},
	})

	const getCachedDatabase = async () => {
		return new Promise((resolve, reject) => {
			const request = window.indexedDB.open("u09", 1)
			console.log('getCachedDB')
			request.onerror = (event) => {
				console.log("error", event)
				reject('Error')
			}

			request.onsuccess = (event) => {
				model.cachedDatabase = event.target.result
				resolve(model.cachedDatabase)
			}

			request.onupgradeneeded = (event) => {
				const database = event.target.result
				database.createObjectStore('schedules', {
					keyPath: '_id',
				})
			}
		})
	}

	const setCachedSchedules = async (schedules) => {
		model.cachedDatabase = await getCachedDatabase()
		console.log('setCachedSchedules')
		return new Promise((resolve, reject) => {
			const transaction = model.cachedDatabase.transaction('schedules', 'readwrite')
			console.log(transaction)
			const store = transaction.objectStore('schedules')

			schedules.forEach(schedule => store.put(schedule))

			transaction.oncomplete = () => {
				console.log('success')
				resolve('Schedules successfully saved')
			}

			transaction.onerror = (event) => {
				console.log('error', event)
				reject(event)
			}
		})
	}

	const getCachedSchedules = async () => {
		model.cachedDatabase = await getCachedDatabase()

		return new Promise((resolve, reject) => {
			const transaction = model.cachedDatabase.transaction('schedules', 'readonly')
			const store = transaction.objectStore('schedules')

			const schedules = []

			store.openCursor().onsuccess = (event) => {
				const cursor = event.target.result
				if (cursor) {
					schedules.push(cursor.value)
					cursor.continue()
				}
			}

			transaction.oncomplete = () => {
				model.schedules = schedules
				resolve(schedules)
			}

			transaction.onerror = (event) => {
				reject(event)
			}
		})
	}

	const getSchedules = async () => {
		if (navigator.onLine) {
			try {
				const response = await axios.get(
					`${baseUrl}/schedules`,
					{
						headers: { "Content-Type": "application/json" },
						withCredentials: true,
					}
				)

				if (response.data.success) {
					model.schedules = response.data.schedules
					console.log(await setCachedSchedules(response.data.schedules))
				}
				return response.data

			} catch (error) {
				return { success: false }
			}
		} else {
			await getCachedSchedules()
		}
	}

	const getSchedule = async (id) => {
		try {
			const response = await axios.get(
				`${baseUrl}/schedule/${id}`,
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)

			if (response.data.success) {
				model.schedule = response.data.schedule
			}
			return response.data

		} catch (error) {
			return { success: false }
		}
	}

	const createSchedule = async (title, duration) => {

		try {
			const response = await axios.post(
				`${baseUrl}/create-schedule`,
				{ ownerId: userStore.model.user._id, title, duration },
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)

			if (response.data.success) {
				model.schedules = [...model.schedules, response.data.schedule]
			}
			return response.data

		} catch (error) {
			return { success: false }
		}
	}

	const updateSchedule = async (id, title, duration) => {
		try {
			const response = await axios.patch(
				`${baseUrl}/update-schedule/${id}`,
				{
					title,
					duration
				},
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)

			if (response.data.success) {
				model.schedule = response.data.updatedSchedule
			}
			return response.data

		} catch (error) {
			return { success: false }
		}
	}

	const deleteSchedule = async (id) => {
		try {
			const response = await axios.delete(
				`${baseUrl}/delete-schedule/${id}`,
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)

			return response.data
		} catch (error) {
			return { success: false }
		}
	}

	const clearState = () => {
		model.schedules = []
		model.schedule = {}
	}

	return { model, getSchedules, createSchedule, updateSchedule, deleteSchedule, getSchedule, clearState }
})
