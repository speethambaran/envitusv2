import mongoose from "mongoose";
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

let ApiKeySchema = new Schema({
    name: { type: String, required: true, unique: true },
    limit: { type: Number, required: true },
    apiKey: { type: String, required: true },
    currentLimit:{ type: Number, default: 0},
    frequency: {type: Number, default: 10},
    isDeleted: { type: Boolean, default: false },
    activated: { type: Boolean, default: true },
    createdBy: { type: mongoose.Types.ObjectId, required: true },
    logs: { type: Array, default: [] }
}, { timestamps: true });

ApiKeySchema.methods.toJSON = function () {
    const api = this
    const apiObject = api.toObject()
    return returnFilter(apiObject)
}
ApiKeySchema.statics.returnFilter = returnFilter

// Export the model
export const ApiKey = mongoose.model("Api_Key", ApiKeySchema);