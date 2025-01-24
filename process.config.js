module.exports = {
	apps: [
		{
			name: 'SERVER',
			cwd: './', // swd -> cwd (current working directory)
			script: './dist/server.js',
			watch: false,
			env: {
				NODE_ENV: 'development' // Default environment
			},
			env_production: {
				NODE_ENV: 'production'
			},
			env_development: {
				NODE_ENV: 'development'
			},
            instances: 1,
            exec_mode: 'cluster'
		}
	]
}
