import TaskService from "../services/database/taskService";

class TaskController {
  constructor() {}

  //---------------- CREATE TASK ------------------
  async createTask(req, res) {
    const user = req.user;
    const result = await TaskService.create(req.body, user);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.json(result);
  }

  //----------------- GET TASK BY USER ID ---------
  async getTasks(req, res) {
    const user = req.user;
    const result = await TaskService.getTasksByUser(user);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.json(result.tasks || result);
  }

  //----------------- UPDATE TASK -----------------
  async updateTask(req, res) {
    const user = req.user;
    const result = await TaskService.update(req.params.id, req.body, user);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.json(result.tasks || result);
  }
  //----------------- DELETE TASK -----------------
  async deleteTask(req, res) {
    const user = req.user;
    const result = await TaskService.delete(req.params.id, user);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.json(result.tasks || result);
  }
}

module.exports = new TaskController();
