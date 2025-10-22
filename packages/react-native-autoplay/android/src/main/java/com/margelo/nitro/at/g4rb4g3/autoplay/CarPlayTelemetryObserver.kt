package com.margelo.nitro.at.g4rb4g3.autoplay


import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.car.app.CarContext
import androidx.car.app.hardware.CarHardwareManager
import androidx.car.app.hardware.common.CarValue
import androidx.car.app.hardware.common.OnCarDataAvailableListener
import androidx.car.app.hardware.info.EnergyLevel
import androidx.car.app.hardware.info.Mileage
import androidx.car.app.hardware.info.Model
import androidx.car.app.hardware.info.Speed
import androidx.car.app.versioning.CarAppApiLevels
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.margelo.nitro.at.g4rb4g3.autoplay.hybrid.NumericTelemetryItem
import com.margelo.nitro.at.g4rb4g3.autoplay.hybrid.StringTelemetryItem
import com.margelo.nitro.at.g4rb4g3.autoplay.hybrid.Telemetry
import com.margelo.nitro.at.g4rb4g3.autoplay.hybrid.VehicleTelemetryItem

object CarPlayTelemetryObserver {
    private lateinit var callback: (Telemetry) -> Unit
    private var isRunning = false
    private var carContext: CarContext? = null

    private val telemetryHolder = CarPlayTelemetryHolder()
    private val handler = Handler(Looper.getMainLooper())

    private val mModelListener = OnCarDataAvailableListener<Model> {
        val vehicle = VehicleTelemetryItem(
            name = if (it.name.status == CarValue.STATUS_SUCCESS) {
                it.name.value?.let { name ->
                    StringTelemetryItem(it.name.timestampMillis / 1000.0, name)
                } ?: null
            } else null,
        manufacturer = if (it.manufacturer.status == CarValue.STATUS_SUCCESS) {
            it.manufacturer.value?.let { manufacturer ->
                StringTelemetryItem(it.manufacturer.timestampMillis / 1000.0, manufacturer)
            } ?: null
        } else null,
            year = if (it.year.status == CarValue.STATUS_SUCCESS) {
                it.year.value?.let { year ->
                    NumericTelemetryItem(it.year.timestampMillis / 1000.0, year.toDouble())
                } ?: null
            } else null
        )

        callback(Telemetry(
            vehicle = vehicle,
            speed = null,
            fuelLevel = null,
            batteryLevel = null,
            range = null,
            odometer = null
        ))
    }

    private val mEnergyLevelListener = OnCarDataAvailableListener<EnergyLevel> { carEnergyLevel ->
        if (carEnergyLevel.batteryPercent.status == CarValue.STATUS_SUCCESS) {
            telemetryHolder.updateBatteryLevel(carEnergyLevel.batteryPercent.value)
        }

        if (carEnergyLevel.fuelPercent.status == CarValue.STATUS_SUCCESS) {
            telemetryHolder.updateFuelLevel(carEnergyLevel.fuelPercent.value)
        }

        if (carEnergyLevel.rangeRemainingMeters.status == CarValue.STATUS_SUCCESS) {
            telemetryHolder.updateRange(carEnergyLevel.rangeRemainingMeters.value?.div(1000f)) //m->km
        }
    }

    private val mSpeedListener = OnCarDataAvailableListener<Speed> { carSpeed ->
        if (carSpeed.displaySpeedMetersPerSecond.status == CarValue.STATUS_SUCCESS) {
            telemetryHolder.updateSpeed(carSpeed.displaySpeedMetersPerSecond.value?.times(3.6f)) //m/s->km/h
        }
    }

    private val mMileageListener = OnCarDataAvailableListener<Mileage> { carMileage ->
        if (carMileage.odometerMeters.status == CarValue.STATUS_SUCCESS) {
            telemetryHolder.updateOdometer(carMileage.odometerMeters.value?.div(1000f)) //m->km
        }
    }

    private val emitter = object : Runnable {
        override fun run() {
            val tlm = telemetryHolder.toTelemetry()

            if (tlm != null) {
                callback(tlm)
            }

            handler.postDelayed(this, /*BuildConfig.CARPLAY_TELEMETRY_INTERVAL_MS*/ 4000)
        }
    }

    fun startTelemetryObserver(
        carContext: CarContext, callback: (Telemetry) -> Unit
    ) {
        CarPlayTelemetryObserver.carContext = carContext
        CarPlayTelemetryObserver.callback = callback

        if (carContext.carAppApiLevel < CarAppApiLevels.LEVEL_3) {
            throw UnsupportedOperationException("Telemetry not supported for this API level ${carContext.carAppApiLevel}")
            return
        }

        val carHardwareExecutor = ContextCompat.getMainExecutor(carContext)

        val carHardwareManager = carContext.getCarService(
            CarHardwareManager::class.java
        )
        val carInfo = carHardwareManager.carInfo

        // Request any single shot values.
        try {
            carInfo.fetchModel(carHardwareExecutor, mModelListener)
        } catch (_: SecurityException) {
        } catch (_: NullPointerException) {
        }

        if (isRunning) {
            // we stop here to not re-register multiple listeners, only the single shot values can be requested multiple times by registering another tlm listener on RN side
            Log.d(CarPlayTelemetryObserver.javaClass.name, "Telemetry observer is already running")
            return
        }

        try {
            carInfo.addEnergyLevelListener(carHardwareExecutor, mEnergyLevelListener)
        } catch (_: SecurityException) {
        } catch (_: NullPointerException) {
        }

        try {
            carInfo.addSpeedListener(carHardwareExecutor, mSpeedListener)
        } catch (_: SecurityException) {
        } catch (_: NullPointerException) {
        }

        try {
            carInfo.addMileageListener(carHardwareExecutor, mMileageListener)
        } catch (_: SecurityException) {
        } catch (_: NullPointerException) {
        }

        handler.post(emitter)

        isRunning = true

        Log.d(CarPlayTelemetryObserver.javaClass.name, "Telemetry observer started")
    }

    fun stopTelemetryObserver() {
        carContext?.let {
            val carHardwareManager = it.getCarService(
                CarHardwareManager::class.java
            )
            val carInfo = carHardwareManager.carInfo

            try {
                carInfo.removeEnergyLevelListener(mEnergyLevelListener)
            } catch (_: SecurityException) {
            }

            try {
                carInfo.removeSpeedListener(mSpeedListener)
            } catch (_: SecurityException) {
            }

            try {
                carInfo.removeMileageListener(mMileageListener)
            } catch (_: SecurityException) {
            }
        }

        handler.removeCallbacks(emitter)

        isRunning = false
    }
}
