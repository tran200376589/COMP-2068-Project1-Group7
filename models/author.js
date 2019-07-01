const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

// Our Schema
const AuthorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Virtual property
AuthorSchema.virtual('passwordConfirmation')
.get(() => this.passwordConfirmation)
.set(value => this.passwordConfirmation = value);

// Helper actions
// Hashes the password using the salt key
AuthorSchema.pre('save', function (next) {
    const author = this;

    if (!author.isModified('password')) return next();
    if (author.password !== author.passwordConfirmation) throw new Error('Your password must match with the password Confirmation');

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(author.password, salt, (err, hash) => {
            if (err) return next(err);
            author.password = hash;
            next();
        });
    });
});

// Authenticate our plain text password against our hashed password
AuthorSchema.methods.authenticate = function (plainPassword, callback) {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

module.exports = mongoose.model('Author', AuthorSchema);