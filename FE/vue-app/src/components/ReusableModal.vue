<template>
	<transition name="modal-animation">
		<div v-show="modalActive" class="custom-modal">
			<transition name="modal-animation-inner">
				<div v-show="modalActive" class="modal-inner">
					<div class="custom-modal-header">
						<h2>{{ modalHeading }}</h2>
						<font-awesome-icon icon="fa-regular fa-xmark-circle" class="close-btn" @click="emit('close')"/>
					</div>
					<div class="custom-modal-body">
						<slot></slot>
					</div>
				</div>
			</transition>
		</div>
	</transition>
</template>

<script setup>
	import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

	// Create the modalActive prop in the parent component and use it to
	// open/close the modal

	// eslint-disable-next-line
	defineProps({
		modalActive: Boolean,
		modalHeading: String
	})

	// eslint-disable-next-line
	const emit = defineEmits(['close'])

</script>

<style scoped lang="scss">
	@import "@/styles/index";

	.custom-modal {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .5);

		.modal-inner {
			position: relative;
			max-width: 640px;
			width: 80%;
			box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
			background-color: $light-rose;
			border-radius: 10px;

			.custom-modal-header {
				display: flex;
				justify-content: space-between;
				padding: 2.2rem 2.6rem;

				.close-btn {
					cursor: pointer;
					font-size: 3rem;
					color: $black;

					&:hover {
						color: $red;
					}
				}
			}

			.custom-modal-body {
				padding: 0 2.6rem 2.2rem 2.6rem;
			}
		}
	}

	.modal-animation-enter-active,
	.modal-animation-leave-active {
		transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
	}

	.modal-animation-enter-from,
	.modal-animation-leave-to {
		opacity: 0;
	}

	.modal-animation-inner-enter-active {
		transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
	}

	.modal-animation-inner-leave-active {
		transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
	}

	.modal-animation-inner-enter-from {
		opacity: 0;
		transform: scale(0.8);
	}

	.modal-animation-inner-leave-to {
		transform: scale(0.8);
	}
</style>