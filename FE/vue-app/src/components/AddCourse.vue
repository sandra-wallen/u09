<template>
	<button type="button"
			class="btn btn-primary align-self-end m-2"
			@click="openModal">
		+ Add
	</button>
	<ReusableModal :modal-active="modalActive" modal-heading="Add course" @close="closeModal">
		<form>
			<div class="text-16 mt-3 mb-4">
				<p class="form-label text-start">Start date & time</p>
				<VueDatePicker v-model="model.course.startDateTime"
							   enable-time-picker
							   :min-date="new Date()"
							   :start-date="new Date()"
							   week-numbers/>
			</div>
			<div class="row gx-0 mb-3">
				<label for="add-course-search-input" class="form-label text-start">Course</label>
				<div class="col-9">
					<input id="add-course-search-input"
						   type="text"
						   class="form-control"
						   placeholder="Search.."
						   v-model="model.course.title"/>
					<div class="search-suggestions-wrapper">
						<CourseSearchResults ref="courseSearchResultsRef"
											 :suggestions="courseSuggestions"
											 @blur="clearCourseSuggestions"
											 :on-select="selectCourseSuggestion"
											 :no-suggestions-found="noCoursesFound"/>
					</div>
				</div>
				<div class="col-3">
					<button type="button" class="btn btn-primary search-btn text-16" @click="searchCourse">Search
					</button>
				</div>
			</div>
			<div class="d-flex justify-content-end mt-5">
				<button type="button" class="btn btn-secondary" @click="closeModal">
					Cancel
				</button>
				<button type="button" class="btn btn-primary ms-1" @click="handleSubmit">
					Add
				</button>
			</div>
		</form>
	</ReusableModal>
</template>

<script setup>
	import { reactive, onMounted, ref } from 'vue'
	import VueDatePicker from '@vuepic/vue-datepicker'
	import '@vuepic/vue-datepicker/dist/main.css'
	import ReusableModal from "@/components/ReusableModal.vue"
	import { useCoursesStore } from "@/stores/CoursesStore"
	import { useSchedulesStore } from "@/stores/SchedulesStore"
	import CourseSearchResults from "@/components/CourseSearchResults.vue"

	const coursesStore = useCoursesStore()
	const scheduleStore = useSchedulesStore()

	const model = reactive({
		course: {
			startDateTime: null,
			title: "",
			_id: ""
		}
	})

	onMounted(() => {
		coursesStore.getCourses()
		model.course.startDateTime = new Date()
	})

	const modalActive = ref(null)

	const courseSearchResultsRef = ref(null)
	const courseSuggestions = ref([])
	const noCoursesFound = ref(false)

	const openModal = () => {
		modalActive.value = true
	}

	const closeModal = () => {
		modalActive.value = false
	}

	const searchCourse = () => {
		model.course._id = ""
		const query = model.course.title

		courseSuggestions.value = coursesStore.model.courses.filter((course) => {
			if (course.title.toLowerCase().includes(query.toLowerCase())) {
				return course
			}
		})

		noCoursesFound.value = courseSuggestions.value.length === 0
	}

	const clearCourseSuggestions = () => {
		courseSuggestions.value = []
		noCoursesFound.value = false
	}

	const selectCourseSuggestion = (suggestion) => {
		model.course._id = suggestion._id
		model.course.title = suggestion.title
		courseSuggestions.value = []
	}

	const handleSubmit = async () => {
		const updateSchedule = await coursesStore.addCourseToSchedule({
			course: model.course._id,
			startDateTime: model.course.startDateTime
		}, scheduleStore.model.schedule._id)

		if (updateSchedule.success) {
			model.course.title = ""
			closeModal()
		}
	}
</script>

<style scoped lang="scss">
	.search-suggestions-wrapper {
		//min-height: 8.5rem;
	}

	.search-btn {
		padding: 0.5rem 1.4rem;
	}
</style>