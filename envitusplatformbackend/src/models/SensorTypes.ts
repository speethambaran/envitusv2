import mongoose from "mongoose";
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

let SensorTypesSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
    sensorParamsIds: { type: Array, default: [] },
}, { timestamps: true });

SensorTypesSchema.methods.toJSON = function () {
    const sensor = this
    const sensorObject = sensor.toObject()
    return returnFilter(sensorObject)
}
SensorTypesSchema.statics.returnFilter = returnFilter;

// Export the model
export const SensorTypes = mongoose.model("Sensor_Types", SensorTypesSchema);