<template>
	<div :id="modalId" class="modal fade">
		<div class="modal-dialog modal-dialog-centered modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h2 class="modal-title">{{modalHeading}}</h2>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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

	const props = defineProps({
		modalHeading: String,
		customId: String,
	})

	const modal = ref(null)

	onMounted(() => {
		const element = document.getElementById(modalId)
		document.body.appendChild(element)
		modal.value = new Modal(element, {backdrop: "static"})
	})

	const modalId = props.customId ? props.customId : "modal-" + String(Math.random() * 10).replace('.', '')

	defineExpose({ modal })

</script>