import mongoose from "mongoose";
import bcryp from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: false,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      unique: false,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      unique: true,
      required: false,
      default: null,
    },
    token: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcryp.genSalt(10);
  this.password = await bcryp.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (passwordForm) {
  return await bcryp.compare(passwordForm, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
