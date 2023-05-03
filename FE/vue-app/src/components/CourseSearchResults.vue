<template>
	<div
		ref="element"
		id="course-search-result"
		@blur="handleBlur"
		class="search-suggestions">
		<ul v-if="suggestions.length > 0" class="list-group position-absolute">
			<li v-for="(suggestion) in suggestions"
				:key="suggestion._id"
				@mousedown="onSelect(suggestion)"
				class="list-group-item py-1 border-on-hover">
				<div class="row">
					<div class="col-12">
						<p class="mb-0 text-14">{{ suggestion.title }}</p>
					</div>
				</div>
			</li>
		</ul>
		<ul v-if="!suggestions.length && noSuggestionsFound" class="list-group position-absolute error-list">
			<li class="list-group-item py-1 text-error">
				<p class="mb-0 text-14">Sökningen gav inga resultat.</p>
			</li>
		</ul>
	</div>
</template>

<script setup>
	import { ref, onUpdated } from "vue"

	// eslint-disable-next-line
	const props = defineProps({
		suggestions: Array,
		onSelect: Function,
		noSuggestionsFound: Boolean
	})

	const element = ref()

	// eslint-disable-next-line
	const emit = defineEmits(["blur"])

	const handleBlur = () => {
		emit('blur')
	}

	onUpdated(() => {
		element.value.focus()
	})
</script>

<style scoped lang="scss">
	.search-suggestions {
		cursor: pointer;
		max-height: 8.5rem;
		overflow-y: scroll;

		ul {
			width: 40rem;

			&.error-list {
				cursor: auto;
			}
		}
	}
</style>