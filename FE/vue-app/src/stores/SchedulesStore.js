import { defineStore } from "pinia";
import { reactive, computed } from "vue";

export const useSchedulesStore = defineStore("schedules", () => {
	const model = reactive({
		schedules: {},
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

			console.log(response);

			const data = await response.json();
			console.log(data);

			model.schedules = data.schedules;
		} catch (error) {
			console.log(error);
		}
	};

	return { model, getSchedules };
});
