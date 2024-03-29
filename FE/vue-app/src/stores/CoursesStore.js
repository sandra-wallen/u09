import { defineStore } from "pinia"
import { reactive } from "vue"
import { useSchedulesStore } from "./SchedulesStore"
import { useUserStore } from "@/stores/UserStore"
import axios from "axios"
import Localbase from "localbase"
export const useCoursesStore = defineStore("courses", () => {
	const indexedDb = new Localbase('coursesStore')
	const schedulesStore = useSchedulesStore()
	const userStore = useUserStore()
	const baseUrl = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : "http://localhost:8000"

	const model = reactive({
		courses: [],
		course: {}
	})

	const getCourses = async () => {
		if (navigator.onLine) {
			try {
				const response = await axios.get(`${baseUrl}/courses`, {
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				})

				if (response.data.success) {
					model.courses = response.data.courses
					indexedDb.collection('courses').set(response.data.courses)
				}

				return { ...response.data, offline: false }

			} catch (error) {
				return { success: false, offline: false }
			}
		} else {
			indexedDb.collection('courses').get().then(courses => {
				model.courses = courses
			})
			return { success: true, offline: true }
		}
	}

	const getCourse = async (id) => {
		try {
			const response = await axios.get(`${baseUrl}/course/${id}`, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			})

			if (response.data.success) {
				model.course = response.data.course
			}
			return response.data

		} catch (error) {
			return { success: false }
		}
	}

	const createCourse = async (course) => {
		try {
			const response = await axios.post(`${baseUrl}/create-course`, {
				ownerId: userStore.model.user._id,
				...course
			}, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			})

			if (response.data.success) {
				model.courses = [...model.courses, response.data.course]
			}
			return response.data

		} catch (error) {
			return { success: false }
		}
	}

	const updateCourse = async (id, course) => {
		try {
			const response = await axios.patch(`${baseUrl}/update-course/${id}`, {
				...course
			}, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			})

			if (response.data.success) {
				model.course = response.data.updatedCourse
			}
			return response.data

		} catch (error) {
			return { success: false }
		}
	}

	// This is a patch method on schedule
	const addCourseToSchedule = async (course, scheduleId) => {
		const updatedCourses = schedulesStore.model.schedule.courses = [...schedulesStore.model.schedule.courses, course]

		try {
			const response = await axios.patch(`${baseUrl}/update-schedule/${scheduleId}`, {
					courses: updatedCourses
				},
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)
			if (response.data.success) {
				schedulesStore.model.schedule = response.data.updatedSchedule
			}

			return response.data

		} catch (error) {
			return { success: false }
		}
	}

	const deleteCourse = async (id) => {
		try {
			const response = await axios.delete(`${baseUrl}/delete-course/${id}`, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			})

			if (response.data.success) {
				const includedInSchedules = schedulesStore.model.schedules.filter(schedule => schedule.courses.some(course => course.course === id))
				includedInSchedules.forEach(schedule => deleteCourseFromSchedule(id, schedule._id))
				await getCourses()
			}
			return response.data
		} catch (error) {
			return { success: false }
		}
	}

	// This is a patch method on schedule
	const deleteCourseFromSchedule = async (courseId, scheduleId) => {
		const filteredCourses = schedulesStore.model.schedule.courses.filter(
			(item) => item.course !== courseId
		)
		try {
			const response = await axios.patch(`${baseUrl}/update-schedule/${scheduleId}`,
				{
					courses: filteredCourses
				},
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)

			if (response.data.success) {
				schedulesStore.model.schedule = response.data.updatedSchedule
			}

			return response.data

		} catch (error) {
			return { success: false }
		}
	}

	const clearState = () => {
		model.courses = []
		model.course = {}
	}

	const clearCachedData = () => {
		indexedDb.delete()
	}

	return {
		model,
		getCourses,
		getCourse,
		updateCourse,
		createCourse,
		addCourseToSchedule,
		deleteCourse,
		deleteCourseFromSchedule,
		clearState,
		clearCachedData
	}
})
