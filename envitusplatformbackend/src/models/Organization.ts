import mongoose from "mongoose";
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

export type OrgDocument = mongoose.Document & {
    email: string;
    password: string;
    name: string;
    role: string;
    isDeleted: boolean;
    activated: boolean;
};

let OrgSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    activated: { type: Boolean, default: true },
    createdBy: { type: mongoose.Types.ObjectId },
    users: { type: Array, default: [] },
    logs: { type: Array, default: [] },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });

OrgSchema.methods.toJSON = function () {
    const org = this;
    const orgObject = org.toObject();
    return returnFilter(orgObject);
}
OrgSchema.statics.returnFilter = returnFilter;

// Export the model
export const Organization = mongoose.model<OrgDocument>("Organization", OrgSchema);