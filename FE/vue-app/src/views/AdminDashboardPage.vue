﻿<template>
	<main class="d-flex flex-column mb-3 px-5">

		<CreateUser v-if="!offline"/>
		<h1 class="align-self-start">Users</h1>

		<table v-if="filteredUsers.length > 0" class="table container-sm mt-3">
			<thead>
			<tr class="text-start text-20">
				<th style="width: 30%" scope="col">E-mail</th>
				<th style="width: 25%" scope="col">Name</th>
				<th style="width: 20%" scope="col" class="hide-on-mobile">Member since</th>
				<th style="width: 10%" scope="col">Admin</th>
				<th v-if="!offline" style="width: 15%" scope="col"></th>
			</tr>
			</thead>
			<tbody class="text-18">
			<tr v-for="(user) in filteredUsers" class="text-start" :key="user._id">
				<td>
					<RouterLink v-if="!offline"
						class="me-3"
						:to="`/admin-dashboard/update-user/${user._id}`">
						{{ user.email }}
					</RouterLink>
					<span v-else>{{ user.email }}</span>
				</td>
				<td>{{ user.name }}</td>
				<td class="hide-on-mobile">{{ convertCreatedAt(user.createdAt) }}</td>
				<td>{{ user.isAdmin ? "Yes" : "No" }}</td>
				<td v-if="!offline">
					<RouterLink
						class="me-3"
						:to="`/admin-dashboard/update-user/${user._id}`">
						<font-awesome-icon icon="fa-regular fa-pen-to-square"/>
					</RouterLink>
					<button
						class="delete-btn"
						type="button"
						@click="handleDelete(user._id)">
						<font-awesome-icon icon="fa-regular fa-trash-alt" class="danger"/>
					</button>
				</td>
			</tr>
			</tbody>
		</table>
		<div v-else class="my-5">
			<h2>You are the only user so far</h2>
		</div>
	</main>
</template>

<script setup>
	import { computed, onMounted, ref } from "vue"
	import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
	import { useAdminStore } from "@/stores/AdminStore"
	import { useUserStore } from "@/stores/UserStore"
	import { useNotification } from "@kyvg/vue3-notification"
	import CreateUser from "@/components/CreateUser.vue"

	const { notify } = useNotification()
	const adminStore = useAdminStore()
	const userStore = useUserStore()

	const offline = ref(false)

	onMounted(async () => {
		const users = await adminStore.getUsers()

		if (!users.success) {
			notify({
				title: "Users couldn't be fetched",
				text: "Please try reloading the page",
				type: "error",
				duration: 6000,
			})
		} else if (users.success && users.offline) {
			notify({
				title: "You are currently offline",
				text: "Users have been loaded from cache, functionality is limited",
				duration: 6000,
			})
		}

		offline.value = users.offline
	})

	// Exclude logged in user from the list
	const filteredUsers = computed(() => {
		return adminStore.model.users.filter(user => user._id !== userStore.model.user._id)
	})

	const convertCreatedAt = (date) => {
		if (date) {
			return new Date(date).toLocaleDateString()
		}
	}

	const handleDelete = async (userId) => {
		const deletedUser = await adminStore.deleteUser(userId)

		if (deletedUser.success) {
			await adminStore.getUsers()
		} else {
			notify({
				title: "User couldn't be deleted",
				text: "Please try again.",
				type: "error",
				duration: 6000,
			})
		}
	}


</script>
<style scoped lang="scss">
	@import "@/styles/index";

	thead {
		color: $dark-gray;
	}

	tbody {
		color: $black;
	}

	.delete-btn {
		border: none;
		background: transparent;
	}

	.hide-on-mobile {
		@include media-breakpoint-down(sm) {
			display: none;
		}
	}
</style>