import Response from '@/utils/response';
import mockData from '@/mock';
import { v4 as uuidV4 } from 'uuid';

const resHandler = new Response();

class TodoController {
  private body;

  constructor(body: string) {
    this.body = body;
  }
  /**
   * 取得 todos
   */
  public getTodos = (_, res) => {
    const handler = resHandler.handle(res);
    try {
      handler.status(200).json({ status: 'success', data: mockData }).end();
    } catch (error) {
      handler.status(400).json({ status: 'failed', message: '失敗' }).end();
    }
  };

  /**
   * 取得 todo
   */
  public getTodo = (req, res) => {
    const handler = resHandler.handle(res);
    try {
      const id = req.params.id;
      const index = mockData.findIndex(d => d.id === id);

      if (index !== -1) {
        handler.status(200).json({ status: 'success', data: mockData[index] }).end();
      } else {
        handler
          .status(400)
          .json({ status: 'failed', message: `查無此ID：${id}` })
          .end();
      }
    } catch (error) {
      handler.status(400).json({ status: 'failed', message: '查詢失敗' }).end();
    }
  };

  /**
   * 修改 todo
   */
  public updateTodo = (req, res) => {
    const handler = resHandler.handle(res);
    try {
      const id = req.params.id;
      const index = mockData.findIndex(d => d.id === id);
      const data = JSON.parse(this.body);

      if (index !== -1 && data.content) {
        mockData[index].content = data.content;
        handler.status(200).json({ status: 'success', data: mockData[index] }).end();
      } else {
        handler
          .status(400)
          .json({ status: 'failed', message: data.content ? `查無此ID：${id}` : '資料格式錯誤' })
          .end();
      }
    } catch (error) {
      handler.status(400).json({ status: 'failed', message: '修改失敗' }).end();
    }
  };

  /**
   * 新增 todo
   */
  public addTodo = (_, res) => {
    const handler = resHandler.handle(res);
    try {
      const data = JSON.parse(this.body);

      mockData.push({
        id: uuidV4(),
        content: data.content,
      });

      handler.status(200).json({ status: 'success', message: '新增成功', data: mockData }).end();
    } catch (error) {
      handler.status(400).json({ status: 'failed', message: '新增失敗' }).end();
    }
  };

  /**
   * 刪除 todo
   */
  public deleteTodo = (req, res) => {
    const handler = resHandler.handle(res);
    try {
      const id = req.params.id;
      const index = mockData.findIndex(d => d.id === id);

      if (index !== -1) {
        mockData.splice(index, 1);
        handler.status(200).json({ status: 'success', data: mockData }).end();
      } else {
        handler
          .status(400)
          .json({ status: 'failed', message: `查無此ID：${id}` })
          .end();
      }
    } catch (error) {
      handler.status(400).json({ status: 'failed', message: '刪除失敗' }).end();
    }
  };

  /**
   * 刪除全部 todo
   */
  public deleteAllTodo = (_, res) => {
    const handler = resHandler.handle(res);
    try {
      mockData.length = 0;
      handler.status(200).json({ status: 'success', data: mockData }).end();
    } catch (error) {
      handler.status(400).json({ status: 'failed', message: '刪除失敗' }).end();
    }
  };
}

export default TodoController;
