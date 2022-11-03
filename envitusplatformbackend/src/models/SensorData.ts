import mongoose from "mongoose";
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

let SensorDataSchema = new Schema({
    deviceId: {
        type: mongoose.Types.ObjectId, required: true // device collection id
    },
    rawDataId: {
        type: mongoose.Types.ObjectId, required: true
    },
    data: {
        type: Object, required: true
    },
    receivedAt: { type: Date }, // data record time in sensor
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Types.ObjectId },
    deletedAt: { type: Date },
}, { timestamps: true });

SensorDataSchema.methods.toJSON = function () {
    const sensor = this
    const sensorObject = sensor.toObject()
    return returnFilter(sensorObject)
}
SensorDataSchema.statics.returnFilter = returnFilter;

// Export the model
export const SensorData = mongoose.model("Sensor_Data", SensorDataSchema);