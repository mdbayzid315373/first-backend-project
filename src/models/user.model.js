import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // bcryptjs safer for Node.js

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    avatar: {
      type: String, // cloudinary url
      required: true
    },
    coverImage: {
      type: String // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video"
      }
    ],
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    refreshToken: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// 🔹 Password hash before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔹 Compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔹 Generate Access Token
userSchema.methods.generateAccessToken = function () {
  if (!process.env.ACCESS_TOKEN_SECRET) throw new Error("ACCESS_TOKEN_SECRET is missing");
  const payload = {
    _id: this._id,
    email: this.email,
    username: this.username,
    fullName: this.fullName
  };
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRY || "15m";

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn });
};

// 🔹 Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  if (!process.env.REFRESH_TOKEN_SECRET) throw new Error("REFRESH_TOKEN_SECRET is missing");
  const payload = { _id: this._id };
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRY || "7d";

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn });
};

export const User = mongoose.model("User", userSchema);
