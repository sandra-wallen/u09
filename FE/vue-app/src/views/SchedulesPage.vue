<template>
	<main className="d-flex flex-column mb-3 px-4">

		<CreateSchedule />

		<table className="table .container-sm">
		<thead>
			<tr>
			<th scope="col">#</th>
			<th scope="col">Title</th>
			<th style="width: 9%" scope="col">Duration</th>
			<th style="width: 9%" scope="col">Courses</th>
			<th style="width: 9%" scope="col"></th>
			<th style="width: 9%" scope="col"></th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(schedule, index) in schedulesStore.model.schedules" :key="schedule._id">
				<th scope="row">{{index + 1}}</th>
				<td>
					<RouterLink to="/">{{schedule.title}}</RouterLink>
				</td>
				<td>{{schedule.duration}} weeks</td>
				<td>{{schedule.courses?.length}}</td>
				<td>
					<RouterLink
						class="btn btn-info"
						:to="`/edit-schedule/${schedule._id}`">
						Edit
					</RouterLink>
				</td>
				<td>
					<button
						class="btn btn-danger"
						type="button"
						@click="handleDelete(schedule._id)"
					>
						Delete
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

	const schedulesStore = useSchedulesStore()

	onMounted(() => {
		schedulesStore.getSchedules()
	})

	const handleDelete = (id) => {
		schedulesStore.deleteSchedule(id)
	}
</script>