import TodoController from '@/controllers/todos.controller';

class TodoRoute {
  public path = '/todos';
  public controller;
  private router;

  constructor(router, body) {
    this.router = router;
    this.controller = new TodoController(body);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.controller.getTodos);
    this.router.get(`${this.path}/:id`, this.controller.getTodo);
    this.router.post(`${this.path}`, this.controller.addTodo);
    this.router.patch(`${this.path}/:id`, this.controller.updateTodo);
    this.router.delete(`${this.path}`, this.controller.deleteAllTodo);
    this.router.delete(`${this.path}/:id`, this.controller.deleteTodo);
  }
}

export default TodoRoute;
