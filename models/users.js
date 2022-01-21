const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  username: {
    type: String,
    require: true,
    trime: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    trime: true,
    unique: true,
  },
  profilePic: {
    type: String,
    default: "/images/profilePic.jpeg",
  },
  location: {

    type: String
  },
  geometry: {
         type: {
             type: String,
             enum: ['Point']
         },
         coordinates: {
             type: [Number]
         }   
    }

    type: String,
  },

  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community'
    }
  ]

});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;