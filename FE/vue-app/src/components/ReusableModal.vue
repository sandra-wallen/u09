<template>
	<div :id="modalId" class="modal fade">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h2 class="modal-title">{{modalHeading}}</h2>
					<button type="button" class="btn-close text-18" data-bs-dismiss="modal" aria-label="Close">
					</button>
				</div>
				<div class="modal-body">
					<slot></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, defineProps, defineExpose } from "vue"
	import Modal from "bootstrap/js/dist/modal"
	import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

	const props = defineProps({
		modalHeading: String,
		customId: String,
	})

	const modal = ref(null)

	onMounted(() => {
		modal.value = new Modal(`#${modalId}`, { backdrop: 'false' })
		document.getElementById(modalId).addEventListener('hidden.bs.modal', (event) => {
			console.log(event)
		})
	})

	const modalId = props.customId ? props.customId : "modal-" + String(Math.random() * 10).replace('.', '')

	defineExpose({ modal })

</script>
<style scoped lang="scss">

	.modal {
		.modal-header {
			padding: 3rem;
			border-bottom: none;
		}

		.modal-body {
			padding: 3rem;
		}

		.close-btn {
			border: none;
			background: transparent;
		}
	}

	// Append child orsakar? dubbla backdrops, men jag måste använda det så detta är en fulfix
	div.modal-backdrop.fade.show {
					opacity: 0 !important;


	}

</style>