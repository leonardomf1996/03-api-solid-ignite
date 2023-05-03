import { app } from './app';
import { env } from './env';

app.listen({
	host: '0.0.0.0', // ajuda a poder conectar o front com a nossa aplicação back-end
	port: env.PORT,
}).then(() => {
	console.log('🚀 HTTP Server Running!');
});
