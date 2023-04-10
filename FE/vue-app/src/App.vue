<template>
	<Notifications position="top center" pauseOnHover />
	<NavBar />
	<router-view />
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
