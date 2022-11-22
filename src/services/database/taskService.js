import Task from "../../models/Task";
import User from "../../models/User";

class TaskService {
  constructor() {}

  //-----------------------------------------------------------------

  async create(data, user) {
    const { title, description, deliverDate, priority } = data;
    console.log(deliverDate);

    //USER VALIDATION
    const userExist = await User.findById(user._id);

    if (!userExist) {
      const error = new Error("The user does not exist");
      return { error: true, msg: error.message };
    }

    if (userExist.confirmed == false) {
      const error = new Error("Invalid Action");
      return { error: true, msg: error.message };
    }

    //VALIDATION
    if (
      title == "" ||
      description == "" ||
      deliverDate == "" ||
      priority == ""
    ) {
      const error = new Error("Check the form fields");
      return { error: true, msg: error.message };
    }

    const newData = {
      title,
      description,
      deliverDate,
      priority,
      createdBy: user._id,
    };
    try {
      const newTask = new Task(newData);
      await newTask.save();
      return { error: false, msg: "Task created successfully" };
    } catch (error) {
      console.log(error);
      return { error: true, msg: "Server Error" };
    }
  }

  //-------------------------------------------------------------------
  async getTasksByUser(user) {
    try {
      const tasks = await Task.find({ createdBy: user._id })
        .populate("createdBy", "name")
        .select("-__v");

      if (tasks.length === 0) {
        return { error: false, msg: "There is no tasks" };
      }
      return { error: false, tasks };
    } catch (error) {
      console.log(error);
      return { error: true, msg: "Server Error" };
    }
  }

  //----------------------------------------------------------------------

  async update(id, data, user) {
    const { title, description, deliverDate, priority, state } = data;

    //USER VALIDATION
    const userExist = await User.findById(user._id);

    if (!userExist) {
      const error = new Error("The user does not exist");
      return { error: true, msg: error.message };
    }

    if (userExist.confirmed == false) {
      const error = new Error("Invalid Action");
      return { error: true, msg: error.message };
    }

    const task = await Task.findById(id);

    if (!task) {
      const error = new Error("The task does not exist");
      return { error: true, msg: error.message };
    }

    if (task.createdBy.toString() === userExist._id.toString()) {
      try {
        task.title = title || task.title;
        task.description = description || task.description;
        task.deliverDate = deliverDate || task.deliverDate;
        task.priority = priority || task.priority;
        task.state = state || task.state;
        await task.save();
        return { error: false, msg: "Task updated successfully" };
      } catch (error) {
        console.log(error);
        return { error: true, msg: "Server Error" };
      }
    } else {
      return { error: true, msg: "Invalid Action" };
    }
  }

  async delete(id, user) {
    //USER VALIDATION
    const userExist = await User.findById(user._id);

    if (!userExist) {
      const error = new Error("The user does not exist");
      return { error: true, msg: error.message };
    }

    if (userExist.confirmed == false) {
      const error = new Error("Invalid Action");
      return { error: true, msg: error.message };
    }

    const task = await Task.findById(id);

    if (!task) {
      const error = new Error("The task does not exist");
      return { error: true, msg: error.message };
    }

    if (task.createdBy.toString() === userExist._id.toString()) {
      try {
        await task.delete();
        return { error: false, msg: "Task deleted successfully" };
      } catch (error) {
        console.log(error);
        return { error: true, msg: "Server Error" };
      }
    }
  }
}

module.exports = new TaskService();
