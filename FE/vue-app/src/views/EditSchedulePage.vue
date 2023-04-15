<template>
	<main>
		<form class="d-flex flex-column justify-content-between">
			<div class="row gx-2 my-4 schedule-wrapper justify-content-start">
				<div class="col-12 mb-4">
					<h1 class="text-start">{{ schedulesStore.model.schedule.title }}</h1>
				</div>
				<div class="col-12 col-md-5 p-2 pe-5">
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
				</div>
				<div class="col-12 col-md-7 p-2">
					<div class="row gx-0">
						<div class="col-6 d-flex justify-content-start align-items-end">
							<h2 class="text-22">Courses</h2>
						</div>
						<div class="col-6 d-flex justify-content-end">
							<AddCourse />
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
									<RouterLink to="/">{{course?.title}}</RouterLink>
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
			<div class="d-flex justify-content-end align-items-end">
				<button type="button" class="btn btn-secondary" @click="closeModal">
					Back
				</button>
				<button type="button" class="btn btn-primary ms-3" @click="handleSubmit">
					Save
				</button>
			</div>
		</form>
	</main>
</template>

<script setup>
	import { onMounted, ref, watch } from "vue";
	import { useRoute } from "vue-router";
	import { useSchedulesStore } from "../stores/SchedulesStore";
	import { useCoursesStore } from "../stores/CoursesStore"
	import AddCourse from "@/components/AddCourse";
	import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

	const courses = ref([])

	const schedulesStore = useSchedulesStore()
	const coursesStore  = useCoursesStore()

	const route = useRoute()

	const id = route.params.id;

	onMounted(async () => {
		await schedulesStore.getSchedule(id)
		await coursesStore.getCourses()

		assignPropertiesToCourses(schedulesStore.model.schedule.courses)
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

	const assignPropertiesToCourses = (arr) => {
		courses.value = schedulesStore.model.schedule.courses;

		arr.forEach((item, index) => {
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

	watch(() => schedulesStore.model.schedule.courses, (currValue, prevValue) => {
		console.log('watch')
		assignPropertiesToCourses(currValue)
	})

</script>
<style scoped lang="scss">
	@import "@/styles/index";

	form {
		min-height: 70vh;
	}

	.delete-btn {
		border: none;
		background: transparent;
	}
</style>