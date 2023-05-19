<template>
	<main class="d-flex flex-column mb-3 px-5">

		<CreateCourse v-if="!offline"/>
		<h1 class="align-self-start">Courses</h1>

		<table v-if="coursesStore.model.courses.length > 0" class="table container-sm">
			<thead>
				<tr class="text-start text-20">
					<th style="width: 30%" scope="col">Title</th>
					<th style="width: 15%" scope="col">Length</th>
					<th style="width: 15%" scope="col">Color</th>
					<th style="width: 20%" scope="col">Usage</th>
					<th v-if="!offline" style="width: 20%" scope="col"></th>
				</tr>
			</thead>
			<tbody class="text-18">
				<tr v-for="(course) in coursesStore.model.courses" class="text-start" :key="course._id">
					<td>
						<RouterLink v-if="!offline" :to="`/edit-course/${course._id}`">{{ course.title }}</RouterLink>
						<span v-else>{{ course.title }}</span>
					</td>
					<td>{{ course.length }} min</td>
					<td>
						<div
							:style="{width: 2 + 'rem', height: 2 + 'rem', backgroundColor: course.color, borderRadius: 50 + '%' }"></div>
					</td>
					<td>{{ includedInSchedulesLength(course._id) }} schedules</td>
					<td v-if="!offline">
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
	import { onMounted, ref } from "vue"
	import CreateCourse from "@/components/CreateCourse.vue"
	import { useNotification } from "@kyvg/vue3-notification"

	const coursesStore = useCoursesStore()
	const schedulesStore = useSchedulesStore()
	const { notify } = useNotification()

	const offline = ref(false)

	onMounted(async () => {
		const courses = await coursesStore.getCourses()

		if (!courses.success) {
			notify({
				title: "Your schedules couldn't be fetched",
				text: "Please try reloading the page",
				type: "error",
				duration: 6000,
			})
		} else if (courses.success && courses.offline) {
			notify({
				title: "You are currently offline",
				text: "Courses have been loaded from cache, functionality is limited",
				duration: 6000,
			})
		}

		offline.value = courses.offline

		//await schedulesStore.getSchedules()
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