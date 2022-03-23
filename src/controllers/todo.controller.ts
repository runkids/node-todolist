import { RouteHandler } from '@/lib/router';
import { HttpStatus } from '@/config';
import TodoService from '@/services/todo.service';

class TodoController {
  private service: TodoService = new TodoService();

  /**
   * 取得 todos
   */
  public getAllTodo: RouteHandler = (_, res) => {
    const todos = this.service.getAllTodos();
    res.status(HttpStatus.OK).json({ status: 'success', data: todos });
  };

  /**
   * 取得 todo
   */
  public getTodo: RouteHandler = (req, res) => {
    const id = req.params.id;
    const todo = this.service.getTodo(id);

    if (todo) {
      res.status(HttpStatus.OK).json({ status: 'success', data: todo });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ status: 'failed', message: `查無此ID：${id}` });
    }
  };

  /**
   * 修改 todo
   */
  public updateTodo: RouteHandler = (req, res) => {
    const id = req.params.id;
    const data = JSON.parse(req.body);
    if (!data.content) {
      res.status(HttpStatus.BAD_REQUEST).json({ status: 'failed', message: '資料格式錯誤: 缺少 content' });
      return;
    }

    const todo = this.service.updateTodo(id, data.content);

    if (todo) {
      res.status(HttpStatus.OK).json({ status: 'success', data: todo });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ status: 'failed', message: `查無此ID：${id}` });
    }
  };

  /**
   * 新增 todo
   */
  public addTodo: RouteHandler = (req, res) => {
    const data = JSON.parse(req.body);

    if (!Object.keys(data).length || !data.content) {
      res.status(HttpStatus.BAD_REQUEST).json({ status: 'failed', message: '新增失敗，資料格式有誤: 缺少 content' });
      return;
    }

    const todos = this.service.addTodo(data.content);

    res.status(HttpStatus.OK).json({ status: 'success', message: '新增成功', data: todos });
  };

  /**
   * 刪除 todo
   */
  public deleteTodo: RouteHandler = (req, res) => {
    const id = req.params.id;
    const todos = this.service.deleteTodo(id);

    if (todos) {
      res.status(HttpStatus.OK).json({ status: 'success', data: todos });
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ status: 'failed', message: `查無此ID: ${id}` });
    }
  };

  /**
   * 刪除全部 todo
   */
  public deleteAllTodo: RouteHandler = (_, res) => {
    const todos = this.service.deleteAllTodos();
    res.status(HttpStatus.OK).json({ status: 'success', data: todos });
  };
}

export default TodoController;
