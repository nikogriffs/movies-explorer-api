const mongoose = require('mongoose');
const validator = require('validator');

function toJSON() {
  const object = this.toObject();
  delete object.password;
  return object;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
}, {
  versionKey: false,
});

userSchema.methods.toJSON = toJSON;
module.exports = mongoose.model('user', userSchema);
