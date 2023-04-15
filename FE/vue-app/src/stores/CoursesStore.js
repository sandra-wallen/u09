import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import { useSchedulesStore } from "./SchedulesStore";

export const useCoursesStore = defineStore("courses", () => {
	const schedulesStore = useSchedulesStore();

	const model = reactive({
		courses: [],
	});

	const { notify } = useNotification();

	const getCourses = async () => {
		try {
			const response = await fetch(`http://localhost:8000/courses`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});

			const data = await response.json();
			if (data.success) {
				model.courses = data.courses;
			}
		} catch (error) {
			notify({
				title: "Something went wrong",
				text: "Courses related to this schedule couln't be found. Please try reloading the page.",
				type: "error",
				duration: 10000,
			});
		}
	};

	const addCourseToSchedule = async (course, scheduleId) => {
		const updatedCourses = schedulesStore.model.schedule.courses = [ ...schedulesStore.model.schedule.courses, course ]

		try {
			const response = await fetch(
				`http://localhost:8000/update-schedule/${scheduleId}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ courses: updatedCourses }),
				}
			);

			console.log(response);
			const data = await response.json();
			console.log(data);
			if (data.success) {
				schedulesStore.model.schedule = data.updatedSchedule;
				return true;
			}
		} catch (error) {
			console.log(error);
		}
	}

	const deleteCourseFromSchedule = async (courseId, scheduleId) => {
		const filteredCourses = schedulesStore.model.schedule.courses.filter(
			(item) => item.course !== courseId
		);
		try {
			const response = await fetch(
				`http://localhost:8000/update-schedule/${scheduleId}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ courses: filteredCourses }),
				}
			);

			console.log(response);
			const data = await response.json();
			console.log(data);
			if (data.success) {
				schedulesStore.model.schedule = data.updatedSchedule;
			}
		} catch (error) {
			console.log(error);
		}
	};

	return { model, getCourses, addCourseToSchedule, deleteCourseFromSchedule };
});
