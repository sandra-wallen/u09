<template>
	<main>
		<h1>{{ schedulesStore.model.schedule.title }}</h1>
		<form>
			<div className="row gx-2 my-4">
				<div className="col-12 col-md-6 p-2">
					<div className="d-flex flex-column align-items-start mb-3">
						<label
							for="inputTitle"
							class="form-label">
							Title
						</label>
						<input
							type="text"
							id="inputTitle"
							class="form-control"
							placeholder="Title"
							v-model="schedulesStore.model.schedule.title"/>
					</div>
					<div className="d-flex flex-column align-items-start mb-3">
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
				<div className="col-12 col-md-6 p-2">
					<h2 className="text-start">Courses</h2>
					<AddCourse />
					<table>
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">Title</th>
								<th scope="col">
									Start date & time
								</th>
								<th style="width: 20%"
									scope="col">
									Length
								</th>
								<th style="width: 20%"
									scope="col">
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(course, index) in courses" :key="course._id">
								<th scope="row">{{index + 1}}</th>
								<td>
									<RouterLink to="/">{{course?.title}}</RouterLink>
								</td>
								<td>{{ course?.startDateTime }}</td>
								<td>{{ course?.length }}</td>
								<td>
									<button type="button" class="btn btn-danger" @click="handleDeleteCourse(course._id)">
										Delete
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
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