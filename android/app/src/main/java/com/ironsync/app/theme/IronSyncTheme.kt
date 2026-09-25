package com.ironsync.app.theme

import android.graphics.Color

/**
 * IronSync Native Android Theme Specs
 * Strict design token alignment matching Figma variables:
 *  - Background: Pitch Black (#0A0A0C)
 *  - Primary Accent: Neon Crimson Red (#FF3D41)
 *  - Secondary Accent: Kinetic Amber (#FFC72C)
 *  - Surface Cards: Deep Dark Slate (#16161A, #18181D, #202026)
 *  - Text: Primary (#F5F5F7), Secondary (#8E8E93), Muted (#48484A)
 */
object IronSyncColors {
    val COLOR_BG = Color.parseColor("#0A0A0C")
    val COLOR_SURFACE_1 = Color.parseColor("#16161A")
    val COLOR_SURFACE_2 = Color.parseColor("#18181D")
    val COLOR_SURFACE_3 = Color.parseColor("#202026")

    val COLOR_ACCENT_CRIMSON = Color.parseColor("#FF3D41")
    val COLOR_ACCENT_CRIMSON_HOVER = Color.parseColor("#FF5558")
    val COLOR_ACCENT_AMBER = Color.parseColor("#FFC72C")
    val COLOR_ACCENT_GREEN = Color.parseColor("#30D158")

    val COLOR_TEXT_PRIMARY = Color.parseColor("#F5F5F7")
    val COLOR_TEXT_SECONDARY = Color.parseColor("#8E8E93")
    val COLOR_TEXT_MUTED = Color.parseColor("#48484A")

    val COLOR_BORDER_SUBTLE = Color.parseColor("#1A1A20")
    val COLOR_BORDER_ACTIVE = Color.parseColor("#FF3D41")
}
