package com.margelo.nitro.at.g4rb4g3.autoplay

import com.margelo.nitro.at.g4rb4g3.autoplay.hybrid.NumericTelemetryItem
import com.margelo.nitro.at.g4rb4g3.autoplay.hybrid.Telemetry

class CarPlayTelemetryHolder {
    private var isDirty = false
    private val lock = Any()

    private var batteryLevel: Float? = null
    private var batteryLevelTimestamp = 0

    private var fuelLevel: Float? = null
    private var fuelLevelTimestamp = 0

    private var range: Float? = null
    private var rangeTimestamp = 0

    private var speed: Float? = null
    private var speedTimestamp = 0

    private var odometer: Float? = null
    private var odometerTimestamp = 0

    fun updateBatteryLevel(value: Float?) = synchronized(lock) {
        batteryLevel = value
        batteryLevelTimestamp = (System.currentTimeMillis() / 1000L).toInt()
        isDirty = true
    }

    fun updateFuelLevel(value: Float?) = synchronized(lock) {
        fuelLevel = value
        fuelLevelTimestamp = (System.currentTimeMillis() / 1000L).toInt()
        isDirty = true
    }

    fun updateRange(value: Float?) = synchronized(lock) {
        range = value
        rangeTimestamp = (System.currentTimeMillis() / 1000L).toInt()
        isDirty = true
    }

    fun updateSpeed(value: Float?) = synchronized(lock) {
        speed = value
        speedTimestamp = (System.currentTimeMillis() / 1000L).toInt()
        isDirty = true
    }

    fun updateOdometer(value: Float?) = synchronized(lock) {
        odometer = value
        odometerTimestamp = (System.currentTimeMillis() / 1000L).toInt()
        isDirty = true
    }

    fun toTelemetry(): Telemetry? {
        synchronized(lock) {
            if (!isDirty) {
                return null
            }

            isDirty = false

            return Telemetry(
                batteryLevel = createNumericTelemetryItem(batteryLevel, batteryLevelTimestamp),
                fuelLevel = createNumericTelemetryItem(fuelLevel, fuelLevelTimestamp),
                range = createNumericTelemetryItem(range, rangeTimestamp),
                speed = createNumericTelemetryItem(speed, speedTimestamp),
                odometer = createNumericTelemetryItem(odometer, odometerTimestamp),
                vehicle = null
            )
        }
    }
}

private fun createNumericTelemetryItem(value: Float?, timestamp: Int): NumericTelemetryItem? {
    if (value == null || timestamp == 0) {
        return null
    }

    return NumericTelemetryItem(timestamp.toDouble(), value.toDouble())
}