import mongoose from "mongoose";
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

let AlertSchema = new Schema({
    deviceId: { type: String, required: true },
    ruleName: { type: String, required: true },
    status: { type: String, required: true },
    log: { type: String },
}, { timestamps: true });

AlertSchema.methods.toJSON = function () {
    const alerts = this
    const alertObject = alerts.toObject()
    return returnFilter(alertObject)
}

AlertSchema.statics.returnFilter = returnFilter

export const Alert = mongoose.model("Alerts", AlertSchema);