import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
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
    default: new Date().toLocaleDateString(),
  },
  deliverDate: {
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
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
