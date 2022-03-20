import App from '@/app';
import TodoRoute from '@/routes/todo.route';

const app = new App([TodoRoute]);

app.listen();
