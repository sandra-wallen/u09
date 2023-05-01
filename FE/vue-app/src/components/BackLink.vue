<template>
	<div class="text-start text-18">
		<a href="#" class="back-link" @click.prevent="goBack">&lt; Back</a>
	</div>
</template>

<script setup>
	import { useRouter } from "vue-router"

	const router = useRouter()

	const goBack = () => {
		router.back()
	}
</script>

<style scoped lang="scss">
	@import "@/styles/index";

	.back-link {
		color: $black;
		&:hover {
			color: $rose-dark;
		}
	}

</style>