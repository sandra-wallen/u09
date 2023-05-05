<template>
	<button type="button"
			class="btn btn-primary align-self-end m-2"
			@click="openModal">
		+ New
	</button>
	<ReusableModal :modal-active="modalActive" modal-heading="New course" @close="closeModal">
		<form class="text-start">
			<div class="row gx-0 gy-4 py-3">
				<div class="col-12">
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
						v-model="model.course.title"/>
				</div>
				<div class="col-12">
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
						v-model="model.course.length"/>
				</div>
				<div class="col-12">
					<label for="create-course-color-input" class="form-label">Color code</label>
					<input type="color"
						   id="create-course-color-input"
						   class="form-control form-control-color"
						   v-model="model.course.color"
						   title="Choose color"/>
				</div>
				<div class="col-12 d-flex justify-content-end mt-5">
					<button type="button" class="btn btn-secondary" @click="closeModal">
						Cancel
					</button>
					<button type="button" class="btn btn-primary ms-3" :disabled="!formValid" @click="handleSubmit">
						Create
					</button>
				</div>
			</div>
		</form>
	</ReusableModal>
</template>

<script setup>
	import ReusableModal from "@/components/ReusableModal.vue"
	import { reactive, ref, computed } from "vue"
	import { useCoursesStore } from "@/stores/CoursesStore"
	import { useNotification } from "@kyvg/vue3-notification"

	const courseStore = useCoursesStore()
	const { notify } = useNotification()

	const model = reactive({
		course: {
			title: "",
			color: "#D7BFBA",
			length: null
		}
	})

	const formValid = computed(() => {
		return model.course.title !== ""
			&& model.course.color !== ""
			&& model.course.length !== null
	})

	const modalActive = ref(false)

	const openModal = () => {
		modalActive.value = true
	}

	const closeModal = () => {
		modalActive.value = false
	}

	const handleSubmit = async () => {
		if (formValid.value) {
			const createdCourse = await courseStore.createCourse(model.course)

			if (createdCourse.success) {
				closeModal()
				notify({
					title: "Course successfully created",
					type: "success",
					duration: 3000
				})
			} else {
				notify({
					title: "Course could not be created",
					text: "Please try again",
					type: "error",
					duration: 6000
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	input {
		&.form-control {
			max-width: 400px;

			&.form-control-color {
				width: 100px;
			}
		}
	}
</style>