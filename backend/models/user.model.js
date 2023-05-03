import mongoose from "mongoose";
import findOrCreate from "mongoose-findorcreate";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config({path: ".env"});

const secret = process.env.JWT_SECRET;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      index: true,
    },
    chatRooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    hash: String,
    salt: String,
  },
  {timestamps: true}
);
UserSchema.plugin(findOrCreate);

UserSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UserSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    },
    secret
  );
};

UserSchema.methods.toAuthJSON = function () {
  return this.generateJWT();
};

UserSchema.methods.getIdJSON = function () {
  return {
    user_id: this._id,
    username: this.username,
  };
};

const User = mongoose.model("User", UserSchema);
export default User;
