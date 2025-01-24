import dotenv from 'dotenv'
import mongoose from 'mongoose'
import server from './app'


dotenv.config({
	path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
})

mongoose
	.connect(process.env.MONGO_URL as string, {})
	.then(data => {
		console.log('Mongo-Db connection okey')
		const PORT = process.env.PORT ?? 9090
		server.listen(PORT, function () {
			console.info(`The server is running  successfull on port : ${PORT}`)
			console.info(`Admin project on http://localhost:${PORT}/admin`)
		})
	})
	.catch(err => console.log('ERROR on connection MONGODB'))
