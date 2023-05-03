<template>
	<main>
		<div class="row gx-2 my-4 schedule-wrapper justify-content-start">
			<div class="col-12 mb-2">
				<BackLink/>
			</div>
			<div class="col-12 mb-4">
				<h1 class="text-start">{{ schedulesStore.model.schedule.title }}</h1>
			</div>
			<div class="col-12 col-md-5 p-2 pe-5">
				<form>
					<div class="d-flex flex-column align-items-start mb-3">
						<label
							for="inputTitle"
							class="form-label">
							Schedule title
						</label>
						<input
							type="text"
							id="inputTitle"
							class="form-control"
							placeholder="Title"
							v-model="schedulesStore.model.schedule.title"/>
					</div>
					<div class="d-flex flex-column align-items-start mb-3">
						<label
							for="inputDuration"
							class="form-label">
							Duration
						</label>
						<select
							id="inputDuration"
							class="form-select"
							aria-label="Input duration"
							v-model="schedulesStore.model.schedule.duration">
							<option disabled value="">
								Duration in weeks
							</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
						</select>
					</div>
					<div class="d-flex justify-content-end">
						<button type="button" class="btn btn-primary ms-3" :disabled="!formValid" @click="handleSubmit">
							Save
						</button>
					</div>
				</form>
			</div>
			<div class="col-12 col-md-7 p-2">
				<div class="row gx-0">
					<div class="col-6 d-flex justify-content-start align-items-end">
						<h2 class="text-22">Courses</h2>
					</div>
					<div class="col-6 d-flex justify-content-end">
						<AddCourse/>
					</div>
					<table class="table container-sm">
						<thead>
							<tr class="text-start text-18">
								<th style="width: 35%" scope="col">Title</th>
								<th style="width: 20%" scope="col">Start date</th>
								<th style="width: 20%" scope="col">Start time</th>
								<th style="width: 15%" scope="col">Length</th>
								<th style="width: 10%" scope="col"></th>
							</tr>
						</thead>
						<tbody class="text-start text-18">
							<tr v-for="(course) in courses" :key="course._id">
								<td>
									<RouterLink to="/">{{ course?.title }}</RouterLink>
								</td>
								<td>{{ convertStartDate(course.startDateTime) }}</td>
								<td>{{ convertStartTime(course.startDateTime) }}</td>
								<td>{{ course?.length }}</td>
								<td>
									<button type="button" class="delete-btn" @click="handleDeleteCourse(course._id)">
										<font-awesome-icon icon="fa-regular fa-trash-alt" class="danger"/>
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup>
	import { computed, onMounted, ref, watch } from "vue"
	import { useRoute } from "vue-router"
	import { useSchedulesStore } from "@/stores/SchedulesStore"
	import { useCoursesStore } from "@/stores/CoursesStore"
	import AddCourse from "@/components/AddCourse"
	import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
	import { useNotification } from "@kyvg/vue3-notification"
	import BackLink from "@/components/BackLink.vue"

	const courses = ref([])

	const schedulesStore = useSchedulesStore()
	const coursesStore = useCoursesStore()
	const { notify } = useNotification()

	const route = useRoute()
	const id = route.params.id

	onMounted(async () => {
		const schedule = await schedulesStore.getSchedule(id)

		if (!schedule.success) {
			notify({
				title: "Couldn't find schedule",
				text: "Please try reloading the page",
				type: "error",
				duration: 10000,
			})
		}
		await coursesStore.getCourses()

		assignPropertiesToCourses(schedulesStore.model.schedule.courses)
	})

	const formValid = computed(() => {
		return schedulesStore.model.schedule.title !== ""
			&& schedulesStore.model.schedule.duration !== ""
	})

	const handleDeleteCourse = (courseId) => {
		coursesStore.deleteCourseFromSchedule(courseId, id)
	}

	const convertStartDate = (date) => {
		if (date) {
			return new Date(date).toLocaleDateString()
		}
	}

	const convertStartTime = (date) => {
		if (date) {
			return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
		}
	}

	// schedule.courses only stores a reference to the course. This method is used to merge the
	// reference with the course
	const assignPropertiesToCourses = (arr) => {
		courses.value = schedulesStore.model.schedule.courses

		// Assign the original array to a new array in order to not change the original array
		const newArr = arr
		newArr.forEach((item, index) => {
			coursesStore.model.courses.find(c => {
				if (c._id === item.course) {
					const courseProperties = {
						_id: c._id,
						ownerId: c.ownerId,
						title: c.title,
						color: c.color,
						length: c.length,
						createdAt: c.createdAt,
						updatedAt: c.updatedAt
					}
					Object.assign(courses.value[index], courseProperties)
				}
			})
		})
	}

	const handleSubmit = async () => {
		if (formValid.value) {
			const updatedSchedule = await schedulesStore.updateSchedule(id, schedulesStore.model.schedule.title, schedulesStore.model.schedule.duration)

			if (updatedSchedule.success) {
				notify({
					title: "Schedule successfully updated",
					type: "success",
					duration: 3000
				})
			} else {
				notify({
					title: "Schedule could not be updated",
					text: "Please try again",
					type: "error",
					duration: 6000
				})
			}
		}
	}

	watch(() => schedulesStore.model.schedule.courses, (currValue, prevValue) => {
		console.log('watch')
		assignPropertiesToCourses(currValue)
	})

</script>
<style scoped lang="scss">
	@import "@/styles/index";

	main {
		min-height: 70vh;
	}

	.delete-btn {
		border: none;
		background: transparent;
	}
</style>