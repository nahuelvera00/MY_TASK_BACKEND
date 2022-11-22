import GroupService from "../services/database/groupService";

class GroupController {
  constructor() {}

  //-------------- CREATE GROUP ------------------------------
  async createGroup(req, res) {
    const user = req.user;
    const result = await GroupService.create(req.body, user);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.json(result);
  }

  //-------------- GET GROUP BY CREATOR or MEMBERS ------------------------------
  async getGroups(req, res) {
    const user = req.user;
    const result = await GroupService.getGroups(user);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.json(result.groups);
  }

  //-------------- ADD MEMBERS ------------------------------
  async addMember(req, res) {
    const user = req.user;
    const { group } = req.params;
    const result = await GroupService.addMember(user, group, req.body);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.json(result);
  }

  //-------------- DELETE MEMBERS ------------------------------
  async deleteMember(req, res) {
    const user = req.user;
    const { group } = req.params;
    const result = await GroupService.deleteMember(user, group, req.body);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.json(result);
  }

  //-------------- ADD TASK ------------------------------
  async addTask(req, res) {
    const user = req.user;
    const { group } = req.params;
    const result = await GroupService.createTask(user, group, req.body);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.json(result);
  }

  //-------------- UPDATE TASK ------------------------------
  async updateTask(req, res) {
    const user = req.user;
    const { group, task } = req.params;
    const result = await GroupService.updateTaskGroup(
      user,
      group,
      task,
      req.body
    );
    if (result.error) {
      return res.status(400).json(result);
    }
    res.json(result);
  }
  //-------------- DELETE TASk ------------------------------
}

module.exports = new GroupController();
