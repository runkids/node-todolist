import { v4 as uuid } from 'uuid';

export type Todo = { id: string; content: string };
const todos: Array<Todo> = [];

class TodoService {
  private getTodoIndex(id: string): number {
    return todos.findIndex(d => d.id === id);
  }

  public getAllTodos(): Todo[] {
    return todos;
  }

  public getTodo(id: string): Todo | null {
    const index = this.getTodoIndex(id);
    return index !== -1 ? todos[index] : null;
  }

  public addTodo(content: string): Todo {
    const todo = {
      id: uuid(),
      content,
    };
    todos.push(todo);
    return todo;
  }

  public updateTodo(id: string, content: string): Todo | null {
    const todo = this.getTodo(id);
    if (todo === null) return null;
    todo.content = content;
    return todo;
  }

  public deleteTodo(id: string): Todo[] | null {
    const index = this.getTodoIndex(id);
    if (index !== -1) {
      todos.splice(index, 1);
      return todos;
    } else {
      return null;
    }
  }

  public deleteAllTodos(): Todo[] {
    todos.length = 0;
    return todos;
  }
}

export default TodoService;
