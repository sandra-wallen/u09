module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ["plugin:vue/vue3-essential", "eslint:recommended"],
	parser: "vue-eslint-parser",
	parserOptions: {
		parser: "@babel/eslint-parser",
	},
	rules: {
		"no-console": "off",
		eqeqeq: "off",
		"prettier/prettier": 0,
		"no-unused-vars": "warn",
		"no-mixed-spaces-and-tabs": "warn",
		"no-useless-escape": "warn"
	},
};
