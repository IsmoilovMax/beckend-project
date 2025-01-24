module.exports = {
	apps: [
		{
			name: 'Flower_Backend',
			cwd: './',
			script: './dist/server.js',
			watch: false,
			env_production: {
				NODE_ENV: 'production'
			}
		}
	]
}
