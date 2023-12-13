import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
});

const Topic = mongoose.model("Topic", TopicSchema);

export { Topic };
