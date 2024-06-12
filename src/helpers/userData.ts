/** @format */
import User from "../models/user";

const getUserData = (userId: string) => {
  console.log(userId);
  return User.findById(userId)
    .select("age weight gender")
    .then((user: any) => {
      if (!user) {
        const error = new Error("User not found.") as any;
        error.statusCode = 404;
        throw error;
      }
      return {
        age: user.age,
        weight: user.weight,
        gender: user.gender,
      };
    })
    .catch((err: any) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      throw err;
    });
};

export default getUserData;
