import mongoose from "mongoose";
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

let SensorRawDataSchema = new Schema({
    deviceId: {
        type: mongoose.Types.ObjectId, required: true
    },
    latitude: { type: String },
    longitude: { type: String },
    receivedAt: { type: Date },
    data: {
        type: Object, required: true
    },
}, { timestamps: true });

SensorRawDataSchema.methods.toJSON = function () {
    const raw = this
    const rawObject = raw.toObject()
    return returnFilter(rawObject)
}
SensorRawDataSchema.statics.returnFilter = returnFilter;

// Export the model
export const SensorRawData = mongoose.model("Sensor_Raw_Data", SensorRawDataSchema);