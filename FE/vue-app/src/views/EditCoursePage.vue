<template>
	<main>
		<div class="row gx-2 my-4">
			<div class="col-12 mb-2">
				<BackLink/>
			</div>
			<div class="col-12 mb-4">
				<h1 class="text-start">{{ coursesStore.model.course.title }}</h1>
			</div>
			<div class="col-12 col-md-5 pe-5">
				<form>
					<div class="row gx-0 gy-4">
						<div class="col-12 d-flex flex-column align-items-start">
							<label
								for="create-course-title-input"
								class="form-label">
								Title
							</label>
							<input
								type="text"
								id="create-course-title-input"
								class="form-control"
								placeholder="Title"
								v-model="coursesStore.model.course.title"/>
						</div>
						<div class="col-12 d-flex flex-column align-items-start">
							<label
								for="create-course-length-input"
								class="form-label">
								Length (minutes)
							</label>
							<input
								type="text"
								id="create-course-length-input"
								class="form-control"
								placeholder="XX min"
								v-model="coursesStore.model.course.length"/>
						</div>
						<div class="col-12 d-flex flex-column align-items-start">
							<label for="create-course-color-input" class="form-label">Color code</label>
							<input type="color"
								   id="create-course-color-input"
								   class="form-control form-control-color"
								   v-model="coursesStore.model.course.color"
								   title="Choose color"/>
						</div>
						<div class="col-12 d-flex justify-content-end">
							<button type="button" class="btn btn-primary ms-3" :disabled="!formValid"
									@click="handleSubmit">
								Save
							</button>
						</div>
					</div>
				</form>
			</div>
			<div class="col-12 col-md-7">
				<h2 class="text-start">Included in schedules</h2>
				<table class="table container-sm">
					<thead>
						<tr class="text-start text-18">
							<th style="width: 35%" scope="col">Title</th>
							<th style="width: 20%" scope="col">Duration</th>
						</tr>
					</thead>
					<tbody class="text-start text-18">
						<tr v-for="(schedule) in includedInSchedules" :key="schedule._id">
							<td>
								<RouterLink :to="`/edit-schedule/${schedule._id}`">{{ schedule.title }}</RouterLink>
							</td>
							<td>{{ schedule.duration }} weeks</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</main>
</template>

<script setup>
	import { useCoursesStore } from "@/stores/CoursesStore"
	import { useSchedulesStore } from "@/stores/SchedulesStore"
	import { computed, onMounted } from "vue"
	import { useRoute, useRouter } from "vue-router"
	import { useNotification } from "@kyvg/vue3-notification"
	import BackLink from "@/components/BackLink.vue"

	const coursesStore = useCoursesStore()
	const schedulesStore = useSchedulesStore()
	const { notify } = useNotification()

	const route = useRoute()
	const router = useRouter()

	const id = route.params.id

	onMounted(() => {
		coursesStore.getCourse(id)
		schedulesStore.getSchedules()
	})

	const formValid = computed(() => {
		return coursesStore.model.course.title !== ""
			&& coursesStore.model.course.length !== null
			&& coursesStore.model.course.color !== ""
	})

	const includedInSchedules = computed(() => {
		return schedulesStore.model.schedules.filter(schedule => schedule.courses.some(course => course.course === id))
	})

	const handleSubmit = async () => {
		if (formValid.value) {
			const updatedCourse = await coursesStore.updateCourse(id, {
				title: coursesStore.model.course.title,
				length: coursesStore.model.course.length,
				color: coursesStore.model.course.color
			})

			if (updatedCourse.success) {
				notify({
					title: "Course successfully updated",
					type: "success",
					duration: 3000
				})
			} else {
				notify({
					title: "Course could not be updated",
					type: "Please try again",
					duration: 6000
				})
			}
		}
	}
</script>

<style scoped lang="scss">

	input {
		&.form-control {
			&.form-control-color {
				width: 100px;
			}
		}
	}

	img {
		&.colorpick-eyedropper-input-trigger {
			display: none;
		}
	}

</style>