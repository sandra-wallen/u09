import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import { useSchedulesStore } from "./SchedulesStore";
import { useUserStore } from "@/stores/UserStore";
import axios from "axios";

export const useCoursesStore = defineStore("courses", () => {
	const schedulesStore = useSchedulesStore();
	const userStore = useUserStore()

	const model = reactive({
		courses: [],
		course: {}
	});

	const getCourses = async () => {
		try {
			const response = await axios.get(`http://localhost:8000/courses`, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			});

			if (response.data.success) {
				model.courses = response.data.courses;
			}

			return response.data

		} catch (error) {
			return { success: false }
		}
	};

	const getCourse = async (id) => {
		try {
			const response = await axios.get(`http://localhost:8000/course/${id}`, {
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
			const response = await axios.post("http://localhost:8000/create-course", {
				ownerId: userStore.model.user._id,
				...course
			}, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			})

			if (response.data.success) {
				model.courses = [ ...model.courses, response.data.course ]
			}
			return response.data;

		} catch (error) {
			return { success: false }
		}
	}

	const updateCourse = async (id, course) => {
		try {
			const response = await axios.patch(`http://localhost:8000/update-course/${id}`, {
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

	const addCourseToSchedule = async (course, scheduleId) => {
		const updatedCourses = schedulesStore.model.schedule.courses = [ ...schedulesStore.model.schedule.courses, course ]

		console.log({
			courses: updatedCourses
		})
		try {
			const response = await axios.patch(`http://localhost:8000/update-schedule/${scheduleId}`, {
					courses: updatedCourses
				},
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			)
			console.log(response)
			if (response.data.success) {
				schedulesStore.model.schedule = response.data.updatedSchedule;
			}

			return response.data

		} catch (error) {
			return { success: false }
		}
	}

	const deleteCourse = async (id) => {
		try {
			const response = await axios.delete(`http://localhost:8000/delete-course/${id}`, {
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

	const deleteCourseFromSchedule = async (courseId, scheduleId) => {
		const filteredCourses = schedulesStore.model.schedule.courses.filter(
			(item) => item.course !== courseId
		);
		try {
			const response = await axios.patch(`http://localhost:8000/update-schedule/${scheduleId}`,
				{
					courses: filteredCourses
				},
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);

			if (response.data.success) {
				schedulesStore.model.schedule = response.data.updatedSchedule;
			}

			return response.data

		} catch (error) {
			return { success: false }
		}
	};

	return { model, getCourses, getCourse, updateCourse, createCourse, addCourseToSchedule, deleteCourse, deleteCourseFromSchedule };
});
