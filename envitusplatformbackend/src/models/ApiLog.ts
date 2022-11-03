import mongoose from "mongoose";
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

let ApiLogSchema = new Schema({
    apikey: { type: String, required: true },
    logs: { type: Array, default: [] },
    status: { type: String, required: true }
}, { timestamps: true })

ApiLogSchema.methods.toJSON = function () {
    const api = this
    const apiObject = api.toObject()
    return returnFilter(apiObject)
}
ApiLogSchema.statics.returnFilter = returnFilter;

export const ApiLog = mongoose.model("Api_Log", ApiLogSchema);
