import TodoController from '@/controllers/todos.controller';
import Router from '@/lib/router';

class TodoRoute {
  public path = '/todos';
  private controller: TodoController = new TodoController();

  constructor(private readonly router: Router) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.controller.getAllTodo);
    this.router.get(`${this.path}/:id/`, this.controller.getTodo);
    this.router.post(this.path, this.controller.addTodo);
    this.router.patch(`${this.path}/:id/`, this.controller.updateTodo);
    this.router.delete(this.path, this.controller.deleteAllTodo);
    this.router.delete(`${this.path}/:id/`, this.controller.deleteTodo);
  }
}

export default TodoRoute;
