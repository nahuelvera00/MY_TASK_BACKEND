import Group from "../../models/Group";
import TaskGroup from "../../models/TaskGroup";
import User from "../../models/User";

class GroupService {
  constructor() {}

  //------------- CREATE GROUP -----------------------------
  async create(data, user) {
    const { name } = data;

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
    if (name == "") {
      const error = new Error("Check the form fields");
      return { error: true, msg: error.message };
    }

    const newData = {
      name,
      createdBy: user._id,
    };

    try {
      const newGroup = new Group(newData);
      newGroup.members.push(user._id);
      await newGroup.save();
      return { error: false, msg: "Group created successfully" };
    } catch (error) {
      console.log(error);
      return { error: true, msg: "Server Error" };
    }
  }

  //--------------- GET GROUP ----------------
  async getGroups(user) {
    try {
      const groups = await Group.find({
        $or: [{ createdBy: user._id }, { members: user._id }],
      })
        .populate("createdBy", "name surname email profileImage")
        .populate("members", "name surname email profileImage")
        .populate("tasks", "-__v -createdBy")
        .select("-__v");

      if (groups.length === 0) {
        return { error: false, msg: "You do not belong to any group" };
      }
      return { error: false, groups };
    } catch (error) {
      console.log(error);
      return { error: true, msg: "Server Error" };
    }
  }

  //------------- ADD MEMBER ----------------
  async addMember(user, groupId, data) {
    const { member } = data;
    try {
      //--------------CREATOR VALIDATION --------------------------------

      const group = await Group.findById(groupId);

      if (!group.createdBy.toString() === user._id.toString()) {
        const error = new Error(
          "Invalid Action, you do not have the necessary permissions for this action"
        );
        return { error: true, msg: error.message };
      }

      //------------- MEMBER VALIDATION --------------------------------
      const userExist = await User.findById(member).select(
        "-password -confirmed -token -createdAt -updatedAt"
      );
      if (!userExist) {
        const error = new Error("The user does not exist");
        return { error: true, msg: error.message };
      }

      //-------------- Validate that the user is not a member of the group ------------------------------

      if (group.members.includes(userExist._id)) {
        const error = new Error("The user is already a member of the group");
        return { error: true, msg: error.message };
      }

      group.members.push(userExist._id);
      await group.save();
      return { error: false, msg: "Group member added successfully" };
    } catch (error) {
      console.log(error);
      return { error: true, msg: "Server Error" };
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  //----------------------------- REMOVE MEMBER --------------------------------/
  ///////////////////////////////////////////////////////////////////////////////

  async deleteMember(user, groupId, data) {
    const { member } = data;

    try {
      //--------------CREATOR VALIDATION --------------------------------

      const group = await Group.findById(groupId);

      if (!group.createdBy.toString() === user._id.toString()) {
        const error = new Error(
          "Invalid Action, you do not have the necessary permissions for this action"
        );
        return { error: true, msg: error.message };
      }

      //------------- MEMBER VALIDATION --------------------------------
      const userExist = await User.findById(member).select(
        "-password -confirmed -token -createdAt -updatedAt"
      );
      if (!userExist) {
        const error = new Error("The user does not exist");
        return { error: true, msg: error.message };
      }

      if (group.createdBy.toString() === userExist._id.toString()) {
        const error = new Error("The creator of the group cannot be deleted");
        return { error: true, msg: error.message };
      }

      //------------- DELETE MEMBER ------------------------------------------------
      if (group.members.includes(userExist._id)) {
        const newMembers = group.members.filter(
          (member) => member._id.toString() != userExist._id.toString()
        );
        group.members = newMembers;
        await group.save();

        return { error: false, msg: "Group member deleted successfully" };
      }
      const error = new Error("The user is already a member of the group");
      return { error: true, msg: error.message };
    } catch (error) {
      console.log(error);
      return { error: true, msg: "Server Error" };
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  //------------ ADD TASK ----------------------------------------------------/
  /////////////////////////////////////////////////////////////////////////////

  async createTask(user, groupId, data) {
    const { title, description, deliverDateGroup, priority, assigned } = data;
    const group = await Group.findById(groupId);

    //------------ FORM VALIDATION ----------------------------------------------------
    if (Object.values(data).includes("")) {
      const error = new Error("Review form fields");
      return { error: true, msg: error.message };
    }

    //----------------ADMIN VALIDATION ACTION -----------------------------
    if (user._id.toString() !== group.createdBy.toString()) {
      const error = new Error("Invalid Action");
      return { error: true, msg: error.message };
    }

    //------------ MEMBER EXIST VALIDATION --------------------------------
    const userExist = await User.findById(assigned).select(
      "-password -confirmed -token -createdAt -updatedAt"
    );

    if (!userExist) {
      const error = new Error("The user does not exist");
      return { error: true, msg: error.message };
    }

    //------------ USER IS MEMBER IN GROUP VALIDATION -----------------------------
    if (!group.members.includes(userExist._id)) {
      const error = new Error("The user does not belong to this group");
      return { error: true, msg: error.message };
    }

    //-------------- CREATE TASK --------------------------------------------------
    const newData = {
      title,
      description,
      deliverDateGroup,
      priority,
      createdBy: user._id,
      assigned,
    };

    try {
      //create task
      const newTaskGroup = new TaskGroup(newData);
      await newTaskGroup.save();
      group.tasks.push(newTaskGroup._id);
      await group.save();
      return { error: false, msg: "Task created successfully" };
    } catch (error) {
      console.log(error);
      return { error: true, msg: "Server error" };
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////
  //--------------------------- UPDATE TASK ----------------------------------------/
  ///////////////////////////////////////////////////////////////////////////////////

  async updateTaskGroup(user, groupId, taskId, data) {
    const { title, description, deliverDateGroup, priority, assigned } = data;
    const group = await Group.findById(groupId);

    //validation administrator
    if (group.createdBy.toString() !== user._id.toString()) {
      const error = new Error("Invalid Action");
      return { error: true, msg: error.message };
    }

    const taskExist = await TaskGroup.findById(taskId).select(
      "-__v -createdBy"
    );

    if (!taskExist) {
      const error = new Error("Task does not exist");
      return { error: true, msg: error.message };
    }

    if (!group.tasks.includes(taskId)) {
      const error = new Error("This task does not belong to the group");
      return { error: true, msg: error.message };
    }

    try {
      taskExist.title = title || taskExist.title;
      taskExist.description = description || taskExist.description;
      taskExist.deliverDateGroup = deliverDateGroup || taskExist.deliverDate;
      taskExist.priority = priority || taskExist.priority;
      taskExist.state = state || taskExist.state;
      taskExist.assigned = assigned || taskExist.assigned;

      await taskExist.save();
      return { error: false, msg: "Task updated successfully" };
    } catch (error) {
      console.log(error.message);
      return { error: true, msg: "Server Error" };
    }
  }

  //------------- DELETE TASK ------------------------------
}

module.exports = new GroupService();
