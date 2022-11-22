import mongoose from "mongoose";

const taskGroupSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    default: "",
    trim: true,
  },
  state: {
    type: String,
    required: true,
    enum: ["In process", "In review", "Complete"],
    default: "In process",
  },
  creationDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  deliverDateGroup: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    required: true,
    enum: ["Low", "Normal", "High"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const TaskGroup = mongoose.model("TaskGroup", taskGroupSchema);

export default TaskGroup;
