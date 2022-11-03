import mongoose from "mongoose";
const Schema = mongoose.Schema;
// filter returned values on requests
const returnFilter = (obj: any) => {
    let tmp = { ...obj }
    tmp.__v = undefined
    return tmp
}

let SensorParametersSchema = new Schema({
    paramName: { type: String },
    displayName: { type: String },
    displayNameHtml: { type: String },
    unit: { type: String },
    unitDisplayHtml: { type: String },
    isDisplayEnabled: { type: Boolean, default: true },
    displayImage: { type: String },
    isPrimary: { type: Boolean, default: false }, // for display purpose in heatmap
    valuePrecision: { type: Number, default: 1 },
    isFilterable: { type: Boolean, default: true },
    maxRanges: { type: Object },
    limits: { type: Array, default: [] },
    isDeleted: { type: Boolean, default: false },
    calibration: {
        type: { type: String, default: 'none' },
        data: { type: Array, default: [] }
    },
    filteringMethod: { type: String, default: 'none' },
    filteringMethodDef: { type: Object, default: {} }
}, { timestamps: true });

SensorParametersSchema.methods.toJSON = function () {
    const sensor = this
    const sensorObject = sensor.toObject()
    return returnFilter(sensorObject)
}
SensorParametersSchema.statics.returnFilter = returnFilter;

// Export the model
export const SensorParameters = mongoose.model("Sensor_Parameters", SensorParametersSchema);