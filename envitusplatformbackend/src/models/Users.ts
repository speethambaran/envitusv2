import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.password = undefined
    tmp.__v = undefined
    tmp.visible = undefined
    return tmp
}

export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
    name: string;
    role: string;
    isDeleted: boolean;
    activated: boolean;
};

let UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    activated: { type: Boolean, default: true },
    role: { type: String, enum: ['Admin', 'Supervisor', 'Operator', 'Super Admin', 'Root'], default: 'Operator' },
    userName: { type: String, required: true },
    deviceLimit: { type: String },
    createdBy: { type: mongoose.Types.ObjectId },
    organization: { type: Array, default: [] },
    logs: { type: Array, default: [] },
    visible: { type: Boolean, default: true }
}, { timestamps: true });

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    return returnFilter(userObject);
}

/**
 * Password hash middleware.
 */
UserSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, (err: mongoose.Error, hash: string) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

const comparePassword = function (hash: string, password: string) {
    bcrypt.compare(password, hash, (err: mongoose.Error, isMatch: boolean) => {

    });
};

UserSchema.methods.comparePassword = comparePassword;
UserSchema.statics.returnFilter = returnFilter;

// Export the model
export const User = mongoose.model<UserDocument>("User", UserSchema);