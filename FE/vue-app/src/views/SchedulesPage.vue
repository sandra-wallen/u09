<template>
	<main class="d-flex flex-column mb-3 px-5">
		<CreateSchedule v-if="!offline"/>
		<h1 class="align-self-start">Schedules</h1>
		<table v-if="schedulesStore.model.schedules.length > 0" class="table container-sm mt-3">
			<thead>
				<tr class="text-start text-20">
					<th style="width: 20%" scope="col">Title</th>
					<th style="width: 9%" scope="col">Duration</th>
					<th style="width: 9%" scope="col">Courses</th>
					<th v-if="!offline" style="width: 9%" scope="col"></th>
				</tr>
			</thead>
			<tbody class="text-18">
				<tr v-for="(schedule) in schedulesStore.model.schedules" class="text-start" :key="schedule._id">
					<td>
						<RouterLink v-if="!offline" :to="`/edit-schedule/${schedule._id}`">{{ schedule.title }}</RouterLink>
						<span v-else>{{ schedule.title }}</span>
					</td>
					<td>{{ schedule.duration }} weeks</td>
					<td>{{ schedule.courses?.length }}</td>
					<td v-if="!offline">
						<RouterLink
							class="me-3"
							:to="`/edit-schedule/${schedule._id}`">
							<font-awesome-icon icon="fa-regular fa-pen-to-square"/>
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
		<div v-else class="my-5">
			<h2>You have no schedules yet</h2>
		</div>
	</main>
</template>

<script setup>
	import { onMounted, ref } from 'vue'
	import { useSchedulesStore } from '@/stores/SchedulesStore'
	import { useCoursesStore } from "@/stores/CoursesStore"
	import { useUserStore } from "@/stores/UserStore"
	import { useAdminStore } from "@/stores/AdminStore"
	import CreateSchedule from '@/components/CreateSchedule'
	import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
	import { useNotification } from "@kyvg/vue3-notification"

	const schedulesStore = useSchedulesStore()
	const coursesStore = useCoursesStore()
	const userStore = useUserStore()
	const adminStore = useAdminStore()
	const { notify } = useNotification()

	const offline = ref(false)

	onMounted(async () => {
		const schedules = await schedulesStore.getSchedules()

		if (!schedules.success) {
			notify({
				title: "Your schedules couldn't be fetched",
				text: "Please try reloading the page",
				type: "error",
				duration: 6000,
			})
		} else if (schedules.success && schedules.offline) {
			notify({
				title: "You are currently offline",
				text: "Schedules have been loaded from cache, functionality is limited",
				duration: 6000,
			})
		}

		offline.value = schedules.offline
		// await
	})

	const handleDelete = async (id) => {
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