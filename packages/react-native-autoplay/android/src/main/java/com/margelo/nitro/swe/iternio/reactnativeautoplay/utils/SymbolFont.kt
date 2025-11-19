package com.margelo.nitro.swe.iternio.reactnativeautoplay.utils

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.Rect
import android.graphics.RectF
import android.graphics.Typeface
import androidx.car.app.CarContext
import androidx.core.content.res.ResourcesCompat
import androidx.core.graphics.createBitmap
import androidx.core.graphics.drawable.IconCompat
import com.margelo.nitro.swe.iternio.reactnativeautoplay.GlyphImage
import com.margelo.nitro.swe.iternio.reactnativeautoplay.NitroImage
import com.margelo.nitro.swe.iternio.reactnativeautoplay.BuildConfig
import com.margelo.nitro.swe.iternio.reactnativeautoplay.R
import com.margelo.nitro.swe.iternio.reactnativeautoplay.template.Parser

object SymbolFont {
    const val TAG = "SymbolFont"

    private var typeface: Typeface? = null

    private fun loadFont(context: Context) {
        if (typeface != null) {
            return
        }

        typeface = ResourcesCompat.getFont(context, R.font.materialsymbolsoutlined_regular)
    }

    private fun imageFromGlyph(
        context: Context,
        glyph: Double,
        color: Int,
        backgroundColor: Int,
        cornerRadius: Float = 8f, //TODO: make accessible and add it to GlyphImage.cacheKey
        fontScale: Float,
    ): Bitmap? {
        loadFont(context)

        val font = typeface ?: run {
            return null
        }

        val virtualScreenDensity = context.resources.displayMetrics.density
        val scale = BuildConfig.SCALE_FACTOR * virtualScreenDensity

        // Minimum recommended image size is 36dp according to https://developers.google.com/cars/design/create-apps/ux-requirements/templated-apps#navigation
        val canvasSize = (36 * scale).toInt()
        val bitmap = createBitmap(canvasSize, canvasSize)
        val canvas = Canvas(bitmap)

        val rectF = RectF(0f, 0f, canvasSize.toFloat(), canvasSize.toFloat())
        var paint = Paint().apply {
            this.color = backgroundColor
            isAntiAlias = true
        }
        canvas.drawRoundRect(rectF, cornerRadius, cornerRadius, paint)

        // Setup text paint
        paint.reset()
        paint = Paint().apply {
            typeface = font
            textSize = canvasSize.toFloat() * fontScale
            this.color = color
            isAntiAlias = true
            textAlign = Paint.Align.LEFT
        }

        // Get the character from codepoint
        val codepoint = glyph.toInt()
        val text = String(Character.toChars(codepoint))

        // Measure text
        val bounds = Rect()
        paint.getTextBounds(text, 0, text.length, bounds)

        // Center the text
        val x = (canvasSize - bounds.width()) / 2f - bounds.left
        val y = (canvasSize - bounds.height()) / 2f - bounds.top

        // Draw text
        canvas.drawText(text, x, y, paint)

        return bitmap
    }

    fun imageFromNitroImage(context: CarContext, image: GlyphImage): Bitmap? {
        var bitmap = BitmapCache.get(context, image)

        if (bitmap != null) {
            return bitmap
        }

        bitmap = imageFromGlyph(
            context = context,
            glyph = image.glyph,
            color = image.color.get(context),
            backgroundColor = image.backgroundColor.get(context),
            fontScale = (image.fontScale ?: 1.0).toFloat()
        )

        bitmap?.let {
            BitmapCache.put(context, image, it)
        }

        return bitmap
    }
}