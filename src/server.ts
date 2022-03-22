import App from '@/app';
import TodoRoute from '@/routes/todo.route';

const app = new App([TodoRoute]);

app.listen(process.env.PORT || 4000);
