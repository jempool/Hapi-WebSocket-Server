import { User } from "../models/user.model.ts";

export default {
  getUserByEmail: async (email: string) => {
    return await User.findOne({ email });
  },

  createUser: async (user) => {
    const newUser = new User({ ...user });
    return await newUser.save();
  },
};
