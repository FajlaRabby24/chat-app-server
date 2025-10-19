import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    profilePic: { type: String, default: "" },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

const UserModel = models.User || model("User", UserSchema);

export default UserModel;
