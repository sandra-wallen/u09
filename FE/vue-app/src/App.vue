<template>
	<div class="col-12 col-xl-8 offset-xl-2">
		<Notifications position="bottom center" pauseOnHover/>
		<NavBar/>
		<router-view/>
	</div>
</template>

<script setup>
	import NavBar from "./components/NavBar"
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
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
