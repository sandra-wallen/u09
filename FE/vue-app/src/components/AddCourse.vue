<template>
	<button type="button"
		class="btn btn-primary align-self-end m-2"
		data-bs-toggle="modal"
		data-bs-target="#addCourseModal">
		Add course
	</button>
	<ReusableModal modalHeading="Add course" customId="addCourseModal">
		<form>
			<div>
				<VueDatePicker v-model="model.course.startDateTime"
					enable-time-picker
					:min-date="new Date()"
					:start-date="new Date()"
					week-numbers />
			</div>
			<div>Search course</div>

			<div class="d-flex justify-content-end">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
				Cancel
			</button>
			<button type="button" class="btn btn-primary ms-1" @click="handleSubmit">
				Create
			</button>
			</div>
		</form>
	</ReusableModal>
</template>

<script setup>
	import { reactive, onMounted } from 'vue';
	import VueDatePicker from '@vuepic/vue-datepicker';
	import '@vuepic/vue-datepicker/dist/main.css';
	import ReusableModal from './ReusableModal';

	const model = reactive({
		course: {
			startDateTime: null,
			course: ""
		}
	})

	onMounted(() => {
		model.course.startDateTime = new Date();
	})

	const handleSubmit = () => {
		console.log('submit')
	}
</script>