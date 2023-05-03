<template>
	<div class="col-12 col-xl-8 offset-xl-2 app-wrapper">
		<Notifications position="bottom center" pauseOnHover/>
		<NavBar/>
		<router-view/>
		<PageFooter/>
	</div>
</template>

<script setup>
	import NavBar from "@/components/NavBar.vue"
	import PageFooter from "@/components/PageFooter.vue"

</script>

<style lang="scss">
	@import "@/styles/index";

	#app {
		font-family: $font-family-base;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		background-color: $light-rose;
	}

	.app-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
