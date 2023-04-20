<template>
	<button type="button"
			class="btn btn-primary align-self-end m-2"
			@click="openModal">
		+ New shedule
	</button>
	<ReusableModal :modal-active="modalActive" modal-heading="New schedule" @close="closeModal">
		<form class="text-start">
			<div class="row gx-0 gy-4 py-3">
			<div class="col-12">
				<label
					for="create-schedule-title-input"
					class="form-label">
					Title
				</label>
				<input
					type="text"
					id="create-schedule-title-input"
					class="form-control"
					placeholder="Title"
					v-model="model.schedule.title"/>
			</div>
			<div class="col-12">
				<label
					for="create-schedule-duration-input"
					class="form-label">
					Duration
				</label>
				<select
					id="create-schedule-duration-input"
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

			<div class="col-12 d-flex justify-content-end mt-5">
				<button type="button" class="btn btn-secondary" @click="closeModal">
					Cancel
				</button>
				<button type="button" class="btn btn-primary ms-3" @click="handleSubmit">
					Create
				</button>
			</div>
			</div>
		</form>
	</ReusableModal>
</template>

<script setup>
import {reactive, ref} from "vue";
import {useSchedulesStore} from "@/stores/SchedulesStore";
import ReusableModal from "@/components/ReusableModal.vue";

const scheduleStore = useSchedulesStore();

const model = reactive({
	schedule: {
		title: "",
		duration: ""
	}
})

const modalActive = ref(false);

const openModal = () => {
	modalActive.value = true
}

const closeModal = () => {
	modalActive.value = false
}

const handleSubmit = async () => {
	const createSchedule = await scheduleStore.createSchedule(model.schedule.title, model.schedule.duration);
	if (createSchedule) {
		closeModal()
	}
}

</script>
<style scoped lang="scss">
@import "@/styles/index";

.form-btns {
	margin-top: 3rem;
}

input {
	&.form-control {
		max-width: 400px;
	}
}

.modal {

	.modal-content {
		background-color: $light-rose;

		.modal-header {
			padding: 3rem;
			border-bottom: none;

			.close-btn {
				border: none;
				background: transparent;
			}
		}

		.modal-body {
			padding: 0 3rem 3rem 3rem;
		}
	}
}
</style>