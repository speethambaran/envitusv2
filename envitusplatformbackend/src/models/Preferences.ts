import mongoose from "mongoose";
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

let PreferencesSchema = new Schema({
    type: {
        type: String, enum: ['device:limit', 'email:config', 'sms:config', 'report:schedule', 'notification']
    },
    data: { type: Object }
}, { timestamps: true })

PreferencesSchema.methods.toJSON = function () {
    const limit = this;
    const limitObject = limit.toObject();
    return returnFilter(limitObject);
}
PreferencesSchema.statics.returnFilter = returnFilter;

export const Preferences = mongoose.model("Preferences", PreferencesSchema)