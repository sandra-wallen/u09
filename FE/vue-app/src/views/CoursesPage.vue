<template>
	<main class="d-flex flex-column mb-3 px-5">

		<table class="table container-sm">
			<thead>
			<tr class="text-start text-20">
				<th style="width: 30%" scope="col">Title</th>
				<th style="width: 15%" scope="col">Length</th>
				<th style="width: 15%" scope="col">Color</th>
				<th style="width: 20%" scope="col">Usage</th>
				<th style="width: 20%" scope="col"></th>
			</tr>
			</thead>
			<tbody class="text-18">
			<tr v-for="(course) in coursesStore.model.courses" class="text-start" :key="course._id">
				<td>
					<RouterLink to="/">{{course.title}}</RouterLink>
				</td>
				<td>{{course.length}} min</td>
				<td>
					<div :style="{width: 2 + 'rem', height: 2 + 'rem', backgroundColor: course.color, borderRadius: 50 + '%' }"></div>
				</td>
				<td>{{ includedInSchedulesLength(course._id) }} schedules</td>
				<td>
					<RouterLink
						class="me-3"
						to="/">
						<font-awesome-icon icon="fa-regular fa-pen-to-square" />
					</RouterLink>
					<button
						class="delete-btn"
						type="button"
						>
						<font-awesome-icon icon="fa-regular fa-trash-alt" class="danger"/>
					</button>
				</td>
			</tr>
			</tbody>
		</table>
	</main>
</template>

<script setup>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import { useCoursesStore } from "@/stores/CoursesStore";
import { useSchedulesStore } from "@/stores/SchedulesStore";
import {onMounted} from "vue";

const coursesStore = useCoursesStore();
const schedulesStore = useSchedulesStore();

onMounted(() => {
	coursesStore.getCourses()
	schedulesStore.getSchedules()
})

const includedInSchedulesLength = (id) => {
	const schedules = schedulesStore.model.schedules.filter(schedule => schedule.courses.some(course => course.course === id))
	return schedules.length;
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