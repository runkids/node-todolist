import { v4 as uuid } from 'uuid';
import mockData, { Todo } from '@/mock';

class TodoService {
  private getTodoIndex(id: string): number {
    return mockData.findIndex(d => d.id === id);
  }

  public getAllTodos(): Todo[] {
    return mockData;
  }

  public getTodo(id: string): Todo | null {
    const index = this.getTodoIndex(id);
    return index !== -1 ? mockData[index] : null;
  }

  public addTodo(content: string): Todo {
    const todo = {
      id: uuid(),
      content,
    };
    mockData.push(todo);
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
      mockData.splice(index, 1);
      return mockData;
    } else {
      return null;
    }
  }

  public deleteAllTodos(): Todo[] {
    mockData.length = 0;
    return mockData;
  }
}

export default TodoService;
