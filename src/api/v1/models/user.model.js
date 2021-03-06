const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const { connectToMongoLocal } = require('../../../configs/db.config');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Departments',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      min: 6,
      max: 30,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(this.password, salt);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.isMatchPassword = async function (password) {
  try {
    return await bcryptjs.compare(password, this.password);
  } catch (error) {
    return next(error);
  }
};

const User = connectToMongoLocal.model('Users', userSchema);

module.exports = User;
