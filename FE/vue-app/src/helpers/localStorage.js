const localStorage = window.localStorage

export const deepKeys = (obj, flat) => {
	let keys = []
	for (let key in obj) {
		keys.push(key)
		if (typeof obj[key] === 'object') {
			const subKeys = deepKeys(obj[key], flat)
			keys = keys.concat(subKeys.map(subKey => {
				return !flat ? key + "." + subKey : subKey
			}))
		}
	}

	return keys
}

export const deepMerge = (target, source) => {
	const result = Array.isArray(target) ? [ ...target ] : { ...target }

	for (let key in source) {
		if (target[key] === undefined || typeof target[key] !== 'object') {
			result[key] = source[key]
		}

		if (typeof target[key] === 'object' && typeof source[key] !== 'object') {
			result[key] = source[key]
		}

		if (typeof target[key] === 'object' && typeof source[key] === 'object') {
			result[key] = deepMerge(target[key], source[key])
		}
	}

	return result
}
export const getLocalStorageItem = (key) => {
	if (key) {
		const item = localStorage.getItem(key)
		return JSON.parse(item)
	}
}

export const setLocalStorageItem = (key, value) => {
	if (key && value) {
		const data = JSON.stringify(value)
		localStorage.setItem(key, data)
	}
}

export const updateLocalStorageItem = (key, value) => {
	if (key && value) {
		const currData = getLocalStorageItem(key)

		if (currData !== null) {
			const newData = deepMerge(currData, value)
			setLocalStorageItem(key, newData)
		} else {
			setLocalStorageItem(key, value)
		}

	}
}

export const removeLocalStorageItem = (key) => {
	if (key) {
		localStorage.removeItem(key)
	}
}