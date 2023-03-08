const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

});



// Hash the password before saving
UserSchema.pre('save', async function() {
    if (this.isModified('passwordHash')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;