package com.margelo.nitro.at.g4rb4g3.autoplay

import android.content.Intent
import androidx.car.app.Screen
import androidx.car.app.Session
import androidx.car.app.SessionInfo
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactContext
import com.margelo.nitro.at.g4rb4g3.autoplay.utils.ReactContextResolver
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.UUID

class AndroidAutoSession(sessionInfo: SessionInfo, private val reactApplication: ReactApplication) : Session() {
    private lateinit var reactContext: ReactContext

    private val isCluster = sessionInfo.displayType == SessionInfo.DISPLAY_TYPE_CLUSTER
    private val clusterTemplateId = if (isCluster) UUID.randomUUID().toString() else null

    private lateinit var screen: AndroidAutoScreen

    override fun onCreateScreen(intent: Intent): Screen {
        screen = AndroidAutoScreen(carContext)
        screen.marker = clusterTemplateId ?: "root"

        lifecycle.addObserver(sessionLifecycleObserver)

        CoroutineScope(Dispatchers.Main).launch {
            reactContext = ReactContextResolver.getReactContext(reactApplication)
            reactContext.addLifecycleEventListener(reactLifecycleObserver)
        }

        return screen
    }

    private val reactLifecycleObserver = object : LifecycleEventListener {
        override fun onHostResume() { }

        override fun onHostPause() { }

        override fun onHostDestroy() {
            carContext.finishCarApp()
        }
    }

    private val sessionLifecycleObserver = object : DefaultLifecycleObserver {
        override fun onDestroy(owner: LifecycleOwner) {
            super.onDestroy(owner)
        }
    }

    companion object {
        const val TAG = "AndroidAutoSession"
    }
}