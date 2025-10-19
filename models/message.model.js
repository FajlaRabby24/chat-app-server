import { model, models, Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    image: { type: String },
    seen: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const MessageModel = models.Message || model("Message", MessageSchema);

export default MessageModel;
