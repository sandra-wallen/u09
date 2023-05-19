import axios from "axios"
import { defineStore } from "pinia"
import { reactive } from "vue"
import { useUserStore } from "@/stores/UserStore"
import Localbase from "localbase"

export const useSchedulesStore = defineStore("schedules", () => {
	const indexedDb = new Localbase('schedulesStore')
	const userStore = useUserStore()
	const baseUrl = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : "http://localhost:8000"

	const model = reactive({
		cachedDatabase: null,
		schedules: [],
		schedule: {},
	})

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
					indexedDb.collection('schedules').set(response.data.schedules)
				}

				return { ...response.data, offline: false }

			} catch (error) {
				return { success: false, offline: false }
			}
		} else {
			indexedDb.collection('schedules').get().then(schedules => {
				model.schedules = schedules
			})
			return { success: true, offline: true }
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

	const clearCachedData = () => {
		indexedDb.delete()
	}

	return { model, getSchedules, createSchedule, updateSchedule, deleteSchedule, getSchedule, clearState, clearCachedData }
})
