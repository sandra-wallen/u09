<template>
	<button type="button"
		class="btn btn-primary align-self-end m-2"
		data-bs-toggle="modal"
		data-bs-target="#newScheduleModal">
		NEW
	</button>
	<ReusableModal ref="createScheduleModal" modalHeading="New schedule" customId="newScheduleModal">
		<form class="text-start">
			<div class="mb-3 d-flex flex-column align-items-start">
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
					v-model="model.schedule.title"/>
			</div>
			<div class="d-flex flex-column align-items-start">
				<label
					for="inputDuration"
					class="form-label">
					Duration
				</label>
				<select
					id="inputDuration"
					class="form-select"
					aria-label="Input duration"
					v-model="model.schedule.duration">
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

			<div class="d-flex justify-content-end form-btns">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
					Cancel
				</button>
				<button type="button" class="btn btn-primary ms-3" @click="handleSubmit">
					Create
				</button>
			</div>
		</form>
	</ReusableModal>
</template>

<script setup>
	import { reactive, ref } from "vue";
	import { useSchedulesStore } from "@/stores/SchedulesStore";
	import ReusableModal from "./ReusableModal"

	const scheduleStore = useSchedulesStore()

	const model = reactive({
		schedule: {
			title: "",
			duration: ""
		}
	})

	const createScheduleModal = ref(null);

	const handleSubmit = async () => {
		const response = await scheduleStore.createSchedule(model.schedule.title, model.schedule.duration)
		if (response) {
			createScheduleModal.value.modal.hide()
			//const backdrop = document.getElementsByClassName('modal-backdrop fade show')
			//console.log(backdrop)
			//backdrop.remove()
		}
	}

</script>
<style scoped lang="scss">
	.form-btns {
		margin-top: 3rem;
	}
</style>