import axios from "axios"
import { defineStore } from "pinia"
import { reactive } from "vue"
import { useUserStore } from "@/stores/UserStore"

export const useSchedulesStore = defineStore("schedules", () => {
	const userStore = useUserStore()
	const baseUrl = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : "http://localhost:8000"

	const model = reactive({
		schedules: [],
		schedule: {},
	})

	const getSchedules = async () => {
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
			}
			return response.data

		} catch (error) {
			return { success: false }
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
				model.schedules = [ ...model.schedules, response.data.schedule ]
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
