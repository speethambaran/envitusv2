export const SensorSpecExclude = [
    'router1', 'router2', 'error_code', 'router3', 'router4', 'gateway', 'timestamp', 'receivedTime', 'uptime', 'AQI', 'prominentPollutant'
]

export const SensorSpec = [
    {
        paramName: "temperature",
        displayName: "Temperature",
        displayNameHtml: "Temperature",
        unit: 'oC',
        unitDisplayHtml: '<sup>o</sup>C',
        isDisplayEnabled: true,
        displayImage: "temperature.png",
        isPrimary: false, // for display purpose in heatmap
        needsLiveData: false, // for display purpose in heatmap (as graph in selection pane)
        valuePrecision: 1,
        isCsvParam: true,
        isFilterable: true,
        signageDisplayLive: true,
        maxRanges: {
            min: -10,
            max: 60
        },
        limits: [
            {
                max: 10,
                color: "00B050",
                description: "Cold"
            },
            {
                min: 10,
                max: 15,
                color: "92D050",
                description: "Cool"
            },
            {
                min: 15,
                max: 25,
                color: "FFFF00",
                description: "Warm"
            },
            {
                min: 25,
                max: 37,
                color: "FF9A00",
                description: "Hot"
            },
            {
                min: 37,
                max: 40,
                color: "FF0000",
                description: "Very Hot"
            },
            {
                min: 40,
                color: "800000",
                description: "Extremely Hot"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "pressure",
        displayName: "Pressure",
        displayNameHtml: "Pressure",
        unit: 'mb',
        unitDisplayHtml: 'mb',
        displayImage: "pressure.png",
        isDisplayEnabled: true,
        needsLiveData: false,
        isPrimary: false,
        valuePrecision: 2,
        isCsvParam: true,
        isFilterable: true,
        signageDisplayLive: true,
        maxRanges: {
            min: 540,
            max: 1100
        },
        limits: [
            {
                max: 980,
                color: "e4e9ed",
                description: "Low"
            },
            {
                min: 980,
                max: 1050,
                color: "00B050",
                description: "Normal"
            },
            {
                min: 1050,
                color: "800000",
                description: "High"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "humidity",
        displayName: "Humidity",
        displayNameHtml: "Humidity",
        unit: '%RH',
        unitDisplayHtml: '%RH',
        isDisplayEnabled: true,
        needsLiveData: false,
        isPrimary: false,
        displayImage: "humidity.png",
        valuePrecision: 2,
        isCsvParam: true,
        isFilterable: true,
        signageDisplayLive: true,
        maxRanges: {
            min: 0,
            max: 90
        },
        limits: [
            {
                max: 25,
                color: "00B050",
                description: "Dry"
            },
            {
                min: 25,
                max: 60,
                color: "92D050",
                description: "Normal"
            },
            {
                min: 60,
                color: "FFFF00",
                description: "Moist"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "PM10",
        displayName: "PM10",
        displayNameHtml: "PM<sub>10</sub>",
        unit: 'µg/m3',
        unitDisplayHtml: '&mu;g/m<sup>3</sup>',
        isDisplayEnabled: true,
        needsLiveData: true,
        isPrimary: false,
        displayImage: "param.png",
        valuePrecision: 2,
        isCsvParam: true,
        isFilterable: true,
        signageDisplayStat: true,
        maxRanges: {
            min: 0,
            max: 450
        },
        limits: [
            {
                max: 50,
                color: "00B050",
                description: "Good"
            },
            {
                min: 50,
                max: 100,
                color: "92D050",
                description: "Satisfactory"
            },
            {
                min: 100,
                max: 250,
                color: "FFFF00",
                description: "Moderate"
            },
            {
                min: 250,
                max: 350,
                color: "FF9A00",
                description: "Poor"
            },
            {
                min: 350,
                max: 430,
                color: "FF0000",
                description: "Very Poor"
            },
            {
                min: 430,

                color: "800000",
                description: "Severe"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "PM2p5",
        displayName: "PM2.5",
        displayNameHtml: "PM<sub>2.5</sub>",
        unit: 'µg/m3',
        unitDisplayHtml: '&mu;g/m<sup>3</sup>',
        isDisplayEnabled: true,
        needsLiveData: true,
        isPrimary: false,
        displayImage: "param.png",
        valuePrecision: 2,
        isCsvParam: true,
        isFilterable: true,
        signageDisplayStat: true,
        maxRanges: {
            min: 0,
            max: 230
        },
        limits: [
            {
                max: 30,
                color: "00B050",
                description: "Good"
            },
            {
                min: 30,
                max: 60,
                color: "92D050",
                description: "Satisfactory"
            },
            {
                min: 60,
                max: 90,
                color: "FFFF00",
                description: "Moderate"
            },
            {
                min: 90,
                max: 120,
                color: "FF9A00",
                description: "Poor"
            },
            {
                min: 120,
                max: 250,
                color: "FF0000",
                description: "Very Poor"
            },
            {
                min: 250,

                color: "800000",
                description: "Severe"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "CO2",
        displayName: "CO2",
        displayNameHtml: "CO<sub>2</sub>",
        unit: 'PPM',
        unitDisplayHtml: 'PPM',
        displayImage: "param.png",
        needsLiveData: true,
        isDisplayEnabled: true,
        isPrimary: false,
        isCsvParam: true,
        isFilterable: true,
        valuePrecision: 3,
        signageDisplayStat: true,
        maxRanges: {
            min: 0,
            max: 5000
        },
        limits: [
            {
                max: 350,
                color: "00B050",
                description: "Good"
            },
            {
                min: 350,
                max: 1000,
                color: "92D050",
                description: "Satisfactory"
            },
            {
                min: 1000,
                max: 2000,
                color: "FFFF00",
                description: "Moderate"
            },
            {
                min: 2000,
                max: 5000,
                color: "FF9A00",
                description: "Poor"
            },
            {

                max: 5000,
                color: "FF0000",
                description: "Very Poor"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "CO",
        displayName: "CO",
        displayNameHtml: "CO",
        unit: 'mg/m3',
        unitDisplayHtml: 'mg/m3',
        displayImage: "param.png",
        isFilteringEnabled: false,
        needsLiveData: true,
        isPrimary: false,
        isDisplayEnabled: true,
        valuePrecision: 3,
        isCsvParam: true,
        isFilterable: true,
        signageDisplayStat: true,
        maxRanges: {
            min: 0,
            max: 5000
        },

        limits: [
            {
                max: 500,
                color: "00B050",
                description: "Good"
            },
            {
                min: 500,
                max: 1000,
                color: "92D050",
                description: "Satisfactory"
            },
            {
                min: 1000,
                max: 1500,
                color: "FFFF00",
                description: "Moderate"
            },
            {
                min: 1500,
                max: 2000,
                color: "FF9A00",
                description: "Poor"
            },
            {
                min: 2000,
                max: 2500,
                color: "FF0000",
                description: "Very Poor"
            },
            {
                min: 2500,
                color: "800000",
                description: "Severe"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "NO2",
        displayName: "NO2",
        displayNameHtml: "NO<sub>2</sub>",
        unit: 'ug/m3',
        unitDisplayHtml: 'ug/m3',
        needsLiveData: true,
        displayImage: "param.png",
        isDisplayEnabled: true,
        isPrimary: false,
        valuePrecision: 3,
        isCsvParam: true,
        isFilterable: true,
        signageDisplayStat: true,
        maxRanges: {
            min: 0,
            max: 2000
        },
        limits: [
            {
                max: 500,
                color: "00B050",
                description: "Good"
            },
            {
                min: 500,
                max: 1000,
                color: "92D050",
                description: "Satisfactory"
            },
            {
                min: 1000,
                max: 1500,
                color: "FFFF00",
                description: "Moderate"
            },
            {
                min: 1500,
                max: 2000,
                color: "FF9A00",
                description: "Poor"
            },
            {
                min: 2000,
                max: 2500,
                color: "FF0000",
                description: "Very Poor"
            },
            {
                min: 2500,
                color: "800000",
                description: "Severe"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "SO2",
        displayName: "SO2",
        displayNameHtml: "SO<sub>2</sub>",
        unit: 'ug/m3',
        unitDisplayHtml: 'ug/m3',
        displayImage: "param.png",
        needsLiveData: true,
        isDisplayEnabled: true,
        isPrimary: false,
        valuePrecision: 3,
        isCsvParam: true,
        isFilterable: true,
        signageDisplayStat: true,
        maxRanges: {
            min: 0,
            max: 3000
        },
        limits: [
            {
                max: 500,
                color: "00B050",
                description: "Good"
            },
            {
                min: 500,
                max: 1000,
                color: "92D050",
                description: "Satisfactory"
            },
            {
                min: 1000,
                max: 1500,
                color: "FFFF00",
                description: "Moderate"
            },
            {
                min: 1500,
                max: 2000,
                color: "FF9A00",
                description: "Poor"
            },
            {
                min: 2000,
                max: 2500,
                color: "FF0000",
                description: "Very Poor"
            },
            {
                min: 2500,
                color: "800000",
                description: "Severe"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "O3",
        displayName: "O3",
        displayNameHtml: "O<sub>3</sub>",
        unit: 'PPM',
        unitDisplayHtml: 'PPM',
        needsLiveData: true,
        displayImage: "param.png",
        isDisplayEnabled: true,
        isPrimary: false,
        valuePrecision: 3,
        isCsvParam: true,
        signageDisplayStat: true,
        maxRanges: {
            min: 0,
            max: 20
        },
        limits: [
            {
                max: 0.0237,
                color: "00B050",
                description: "Good"
            },
            {
                min: 0.0237,
                max: 0.0473,
                color: "92D050",
                description: "Satisfactory"
            },
            {
                min: 0.0473,
                max: 0.0795,
                color: "FFFF00",
                description: "Moderate"
            },
            {
                min: 0.0795,
                max: 0.0984,
                color: "FF9A00",
                description: "Poor"
            },
            {
                min: 0.0984,
                max: 0.354,
                color: "FF0000",
                description: "Very Poor"
            },
            {
                min: 0.354,
                color: "800000",
                description: "Severe"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "noise",
        displayName: "Noise",
        displayNameHtml: "Noise",
        unit: 'dBA',
        unitDisplayHtml: 'dBA',
        isDisplayEnabled: true,
        needsLiveData: false,
        isPrimary: false,
        displayImage: "megaphonegrey.png",
        valuePrecision: 2,
        isCsvParam: true,
        signageDisplayLive: true,
        maxRanges: {
            min: 0,
            max: 140
        },
        limits: [
            {
                max: 40,
                color: "00B050",
                description: "Faint"
            },
            {
                min: 40,
                max: 80,
                color: "92D050",
                description: "Moderate"
            },
            {
                min: 80,
                max: 110,
                color: "FFFF00",
                description: "Loud"
            },
            {
                min: 110,
                max: 140,
                color: "FF9A00",
                description: "Pain"
            },
            {
                min: 140,
                color: "ff0000",
                description: "Intolerable"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "rain",
        displayName: "Rain",
        displayNameHtml: "Rain",
        unit: 'mm',
        unitDisplayHtml: 'mm',
        isDisplayEnabled: true,
        needsLiveData: false,
        isPrimary: false,
        displayImage: "raingrey.png",
        valuePrecision: 2,
        needCumil: true,
        needSpecific: true,
        isCsvParam: true,
        signageDisplayStat: true,
        maxRanges: {
            min: 0,
            max: 999.8
        },
        limits: [
            {
                max: 2.5,
                color: "92D050",
                description: "Light Rain"
            },
            {
                min: 2.5,
                max: 10,
                color: "FFFF00",
                description: "Moderate Rain"
            },
            {
                min: 10,
                max: 50,
                color: "FF9A00",
                description: "Heavy Rain"
            },
            {
                min: 50,
                color: "ff0000",
                description: "Violent"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "UV",
        displayName: "UV",
        displayNameHtml: "UV",
        unit: "nm",
        unitDisplayHtml: "nm",
        displayImage: "param.png",
        needsLiveData: false,
        isDisplayEnabled: true,
        isPrimary: false,
        valuePrecision: 2,
        isCsvParam: true,
        signageDisplayStat: true,
        maxRanges: {
            min: 200,
            max: 370
        },
        limits: [
            {
                max: 280,
                color: "F68E3D",
                description: "Dangerous"
            },
            {
                min: 280,
                max: 315,
                color: "F0503D",
                description: "Burning"
            },
            {
                min: 315,
                color: "b51807",
                description: "Tanning"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "lux",
        displayName: "Light",
        displayNameHtml: "Light",
        unit: "lux",
        unitDisplayHtml: "lux",
        displayImage: "param.png",
        needsLiveData: false,
        isDisplayEnabled: true,
        isPrimary: false,
        valuePrecision: 2,
        isCsvParam: true,
        signageDisplayStat: true,
        maxRanges: {
            min: 0,
            max: 35000
        },
        limits: [
            {
                max: 1,
                color: "00ff85",
                description: "Equivalent to Twilight"
            },
            {
                min: 1,
                max: 2,
                color: "00ff2b",
                description: "Equivalent to risk lighting"
            },
            {
                min: 2,
                max: 5,
                color: "b0ff00",
                description: "Equivalent to side road lighting"
            },
            {
                min: 5,
                max: 10,
                color: "ccff00",
                description: "Equivalent to Sunset"
            },
            {
                min: 10,
                max: 15,
                color: "f0ff00",
                description: "Equivalent to main road lighting"
            },
            {
                min: 15,
                max: 50,
                color: "fff400",
                description: "Equivalent to passageway lighting"
            },
            {
                min: 50,
                max: 300,
                color: "ffce00",
                description: "Equivalent to easy reading lighting"
            },
            {
                min: 300,
                max: 500,
                color: "ffa700",
                description: "Equivalent to office lighting"
            },
            {
                min: 500,
                max: 5000,
                color: "ff6700",
                description: "Equivalent to overcast sky"
            },
            {
                min: 5000,
                color: "ff1a00",
                description: "Equivalent to summer"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "receivedTime",
        displayName: "receivedTime",
        displayNameHtml: "receivedTime",
        unit: '',
        unitDisplayHtml: '',
        displayImage: "param.png",
        needsLiveData: false,
        isDisplayEnabled: true,
        isPrimary: false,
        valuePrecision: 0,
        maxRanges: null,
        isCsvParam: false,
        isFilterable: false,
        signageDisplayLive: true,
        valueType: "date",
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "rawAQI",
        displayName: "Raw AQI",
        displayNameHtml: "Raw AQI",
        unit: '',
        unitDisplayHtml: '',
        displayImage: "param.png",
        needsLiveData: false,
        isDisplayEnabled: true,
        isPrimary: false,
        valuePrecision: 0,
        isDerivedParam: true,
        isCsvParam: true,
        isFilterable: false,
        maxRanges: {
            min: 0,
            max: 500
        },
        limits: [
            {
                max: 50,
                color: "00B050",
                description: "Good"
            },
            {
                min: 50,
                max: 100,
                color: "92D050",
                description: "Satisfactory"
            },
            {
                min: 100,
                max: 200,
                color: "FFFF00",
                description: "Moderate"
            },
            {
                min: 200,
                max: 300,
                color: "FF9A00",
                description: "Poor"
            },
            {
                min: 300,
                max: 400,
                color: "FF0000",
                description: "Very Poor"
            },
            {
                min: 400,
                //   max:500,
                color: "800000",
                description: "Severe"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "AQI",
        displayName: "AQI",
        displayNameHtml: "AQI",
        unit: '',
        unitDisplayHtml: '',
        displayImage: "param.png",
        needsLiveData: false,
        isDisplayEnabled: true,
        isPrimary: true,
        valuePrecision: 0,
        isDerivedParam: true,
        isCsvParam: true,
        isFilterable: false,
        signageDisplayAqiParam: true,
        maxRanges: {
            min: 0,
            max: 500
        },
        limits: [
            {
                max: 50,
                color: "00B050",
                description: "Good"
            },
            {
                min: 50,
                max: 100,
                color: "92D050",
                description: "Satisfactory"
            },
            {
                min: 100,
                max: 200,
                color: "FFFF00",
                description: "Moderate"
            },
            {
                min: 200,
                max: 300,
                color: "FF9A00",
                description: "Poor"
            },
            {
                min: 300,
                max: 400,
                color: "FF0000",
                description: "Very Poor"
            },
            {
                min: 400,
                //   max:500,
                color: "800000",
                description: "Severe"
            }
        ],
        filteringMethod : "",
        filteringMethodDef : {}
    },
    {
        paramName: "prominentPollutant",
        displayName: "Prominent Pollutant",
        displayNameHtml: "Prominent Pollutant",
        unit: '',
        unitDisplayHtml: '',
        displayImage: "param.png",
        needsLiveData: false,
        isDisplayEnabled: true,
        isPrimary: false,
        valuePrecision: 0,
        maxRanges: null,
        isCsvParam: true,
        isFilterable: false,
        signageDisplayAqiParam: true,
        isDerived: true,
        valueType: "string",
        filteringMethod : "",
        filteringMethodDef : {}
    }

]

export const Errors = ["er_init_sensor", "er_read_sensor", "er_data_range", "er_system"]

export const typeOneErr = [
    "CHIPCAP2 Temperature, Humidity",
    "BMP180 Pressure",
    "CM1106 CO2",
    "Alphasense NO2",
    "Alphasense S02",
    "Alphasense CO",
    "Alphasense O3",
    "TSL2561 Light",
    "VEML6070 UV",
    "PMS5003 PM10, PM2.5",
    "INMP401 Noise",
    "RG11 Rain",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved",
    "Reserved"
]

export const systemErr = [
    "Interface - I2C Init Error",
    "Interface - UART0 Init Error",
    "Interface - UART1 Init Error",
    "Interface - USB Init Error",
    "Interface - GPIO Init Error",
    "Interface - Reserved",
    "Interface - Reserved",
    "Interface - Reserved",
    "Network - GSM Init Error",
    "Network - GSM Conn. Error",
    "Network - GSM Data Send Fail",
    "Network - Ethernet Conn. Error",
    "Network - Ethernet Data Send Fail",
    "Network - Wi-Fi Conn. Error",
    "Network - Wi-Fi Data Send Fail",
    "Network - Reserved",
    "Other - High CPU Usage",
    "Other - High Memory Usage",
    "Other - Device Config Error",
    "Other - OTA Config Error",
    "Other - OTA Update Error",
    "Other - Datalogging Error",
    "Other - Event Logging Error",
    "Other - SD Card Error",
    "Other - Reserved",
    "Other - Reserved",
    "Other - Reserved",
    "Other - Reserved",
    "Other - Reserved",
    "Other - Reserved",
    "Other - Reserved",
    "Other - Reserved"
]