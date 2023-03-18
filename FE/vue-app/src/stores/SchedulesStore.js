import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import { useCoursesStore } from "./CoursesStore";

export const useSchedulesStore = defineStore("schedules", () => {
	const { notify } = useNotification();
	const coursesStore = useCoursesStore();

	const model = reactive({
		schedules: [],
		schedule: {},
	});

	const getSchedules = async () => {
		try {
			const response = await fetch("http://localhost:8000/schedules", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});
			const data = await response.json();
			model.schedules = data.schedules;
		} catch (error) {
			notify({
				title: "Something went wrong",
				text: "Your schedules couldn't be fetched. Please try reloading the page.",
				type: "error",
				duration: 10000,
			});
		}
	};

	const deleteSchedule = async (id) => {
		try {
			const response = await fetch(
				`http://localhost:8000/delete-schedule/${id}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);
			const data = await response.json();
			if (data.success) {
				getSchedules();
			}
		} catch (error) {
			notify({
				title: "Something went wrong",
				text: "Your schedule couldn't be deleted. Please try again.",
				type: "error",
				duration: 10000,
			});
		}
	};

	const getSchedule = async (id) => {
		try {
			const response = await fetch(
				`http://localhost:8000/schedule/${id}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);

			const data = await response.json();
			if (data.success) {
				model.schedule = data.schedule;
			}
		} catch (error) {
			notify({
				title: "Something went wrong",
				text: "Couldn't find schedule. Please try again.",
				type: "error",
				duration: 10000,
			});
		}
	};

	return { model, getSchedules, deleteSchedule, getSchedule };
});
