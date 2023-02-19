const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required!'],
    },
    firstName: {
        type: String,
        required: [true, 'First Name is required!'],
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required!'],
    },
    password: {
        type: String,
        required: true,
    }
});

// Password validation through the Model
//     }}, {
//         virtuals: {
//             rePass: {
//                 set(value) {
//                     if (this.password !== value ) {
//                         throw new mongoose.Error('Password mismatch!');
//                     }
//                 }
//             }
//         }
//     }
// );

const User = mongoose.model('User', userSchema);

module.exports = User;

// Attaching Virtual property outside of the model
// userSchema.virtual('rePass').set 