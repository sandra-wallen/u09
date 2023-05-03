<template>
	<main class="d-flex flex-column mb-3 px-5">

		<CreateCourse/>
		<h1 class="align-self-start">Courses</h1>

		<table v-if="coursesStore.model.courses.length > 0" class="table container-sm">
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
						<RouterLink :to="`/edit-course/${course._id}`">{{ course.title }}</RouterLink>
					</td>
					<td>{{ course.length }} min</td>
					<td>
						<div
							:style="{width: 2 + 'rem', height: 2 + 'rem', backgroundColor: course.color, borderRadius: 50 + '%' }"></div>
					</td>
					<td>{{ includedInSchedulesLength(course._id) }} schedules</td>
					<td>
						<RouterLink
							class="me-3"
							:to="`/edit-course/${course._id}`">
							<font-awesome-icon icon="fa-regular fa-pen-to-square"/>
						</RouterLink>
						<button
							class="delete-btn"
							type="button"
							@click="deleteCourse(course._id)">
							<font-awesome-icon icon="fa-regular fa-trash-alt" class="danger"/>
						</button>
					</td>
				</tr>
			</tbody>
		</table>
		<div v-else class="my-5">
			<h2>You have no courses yet</h2>
		</div>
	</main>
</template>

<script setup>
	import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
	import { useCoursesStore } from "@/stores/CoursesStore"
	import { useSchedulesStore } from "@/stores/SchedulesStore"
	import { onMounted } from "vue"
	import CreateCourse from "@/components/CreateCourse.vue"
	import { useNotification } from "@kyvg/vue3-notification"

	const coursesStore = useCoursesStore()
	const schedulesStore = useSchedulesStore()
	const { notify } = useNotification()

	onMounted(() => {
		coursesStore.getCourses()
		schedulesStore.getSchedules()
	})

	const includedInSchedulesLength = (id) => {
		const schedules = schedulesStore.model.schedules.filter(schedule => schedule.courses.some(course => course.course === id))
		return schedules.length
	}

	const deleteCourse = async (id) => {
		const deletedCourse = await coursesStore.deleteCourse(id)

		if (deletedCourse.success) {
			notify({
				title: "Course successfully deleted",
				type: "success",
				duration: 3000
			})
		} else {
			notify({
				title: "Course could not be deleted",
				type: "Please try again",
				duration: 6000
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