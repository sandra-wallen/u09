<template>
	<main class="d-flex flex-column mb-3 px-5">

		<CreateSchedule />
		<h1 class="align-self-start">Schedules</h1>

		<table class="table container-sm mt-3">
		<thead>
			<tr class="text-start text-20">
				<th style="width: 20%" scope="col">Title</th>
				<th style="width: 9%" scope="col">Duration</th>
				<th style="width: 9%" scope="col">Courses</th>
				<th style="width: 9%" scope="col"></th>
			</tr>
		</thead>
		<tbody class="text-18">
			<tr v-for="(schedule) in schedulesStore.model.schedules" class="text-start" :key="schedule._id">
				<td>
					<RouterLink :to="`/edit-schedule/${schedule._id}`">{{schedule.title}}</RouterLink>
				</td>
				<td>{{schedule.duration}} weeks</td>
				<td>{{schedule.courses?.length}}</td>
				<td>
					<RouterLink
						class="me-3"
						:to="`/edit-schedule/${schedule._id}`">
						<font-awesome-icon icon="fa-regular fa-pen-to-square" />
					</RouterLink>
					<button
						class="delete-btn"
						type="button"
						@click="handleDelete(schedule._id)">
						<font-awesome-icon icon="fa-regular fa-trash-alt" class="danger"/>
					</button>
				</td>
			</tr>
		</tbody>
		</table>
	</main>
</template>

<script setup>
	import { onMounted } from 'vue';
	import { useSchedulesStore } from '@/stores/SchedulesStore';
	import CreateSchedule from '@/components/CreateSchedule';
	import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
	import { useNotification } from "@kyvg/vue3-notification";

	const schedulesStore = useSchedulesStore()
	const { notify } = useNotification();

	onMounted(async () => {
		const schedules = await schedulesStore.getSchedules()

		if (!schedules.success) {
			notify({
				title: "Your schedules couldn't be fetched",
				text: "Please try reloading the page",
				type: "error",
				duration: 6000,
			});
		}
	})

	const handleDelete = async(id) => {
		const deletedSchedule = await schedulesStore.deleteSchedule(id)

		if (deletedSchedule.success) {
			await schedulesStore.getSchedules()
		} else {
			notify({
				title: "Your schedule couldn't be deleted",
				text: "Please try again.",
				type: "error",
				duration: 6000,
			})
		}
	}
</script>
<style scoped lang="scss">
	@import "@/styles/index";

	thead {
		color: $dark-gray;
	}

	tbody {
		color: $black;
	}

	.delete-btn {
		border: none;
		background: transparent;
	}
</style>