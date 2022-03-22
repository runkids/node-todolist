import mockData from '@/mock';
import { v4 as uuidV4 } from 'uuid';
import { RouteMiddleware } from '@/lib/router';
import { HttpStatus } from '@/config';

class TodoController {
  /**
   * 取得 todos
   */
  public getAllTodo: RouteMiddleware = (_, res) => {
    try {
      res.status(HttpStatus.OK).json({ status: 'success', data: mockData }).end();
    } catch (error) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: 'failed', message: `查詢失敗: ${error}` })
        .end();
    }
  };

  /**
   * 取得 todo
   */
  public getTodo: RouteMiddleware = (req, res) => {
    try {
      const id = req.params.id;
      const index = mockData.findIndex(d => d.id === id);

      if (index !== -1) {
        res.status(HttpStatus.OK).json({ status: 'success', data: mockData[index] }).end();
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ status: 'failed', message: `查無此ID：${id}` })
          .end();
      }
    } catch (error) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: 'failed', message: `查詢失敗: ${error}` })
        .end();
    }
  };

  /**
   * 修改 todo
   */
  public updateTodo: RouteMiddleware = (req, res) => {
    try {
      const id = req.params.id;
      const index = mockData.findIndex(d => d.id === id);
      const data = JSON.parse(req.body);

      if (index !== -1 && data.content) {
        mockData[index].content = data.content;
        res.status(HttpStatus.OK).json({ status: 'success', data: mockData[index] }).end();
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ status: 'failed', message: data.content ? `查無此ID：${id}` : '資料格式錯誤' })
          .end();
      }
    } catch (error) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: 'failed', message: `修改失敗: ${error}` })
        .end();
    }
  };

  /**
   * 新增 todo
   */
  public addTodo: RouteMiddleware = (req, res) => {
    try {
      const data = JSON.parse(req.body);

      if (!data || !data.content) {
        res.status(HttpStatus.BAD_REQUEST).json({ status: 'failed', message: '新增失敗，資料格式有誤' }).end();
        return;
      }

      mockData.push({
        id: uuidV4(),
        content: data.content,
      });

      res.status(HttpStatus.OK).json({ status: 'success', message: '新增成功', data: mockData }).end();
    } catch (error) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: 'failed', message: `新增失敗: ${error}` })
        .end();
    }
  };

  /**
   * 刪除 todo
   */
  public deleteTodo: RouteMiddleware = (req, res) => {
    try {
      const id = req.params.id;
      const index = mockData.findIndex(d => d.id === id);

      if (index !== -1) {
        mockData.splice(index, 1);
        res.status(HttpStatus.OK).json({ status: 'success', data: mockData }).end();
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ status: 'failed', message: `查無此ID: ${id}` })
          .end();
      }
    } catch (error) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: 'failed', message: `刪除失敗: ${error}` })
        .end();
    }
  };

  /**
   * 刪除全部 todo
   */
  public deleteAllTodo: RouteMiddleware = (_, res) => {
    try {
      mockData.length = 0;
      res.status(HttpStatus.OK).json({ status: 'success', data: mockData }).end();
    } catch (error) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: 'failed', message: `刪除失敗: ${error}` })
        .end();
    }
  };
}

export default TodoController;
