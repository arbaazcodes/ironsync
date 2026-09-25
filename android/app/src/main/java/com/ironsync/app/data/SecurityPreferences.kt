package com.ironsync.app.data

import android.content.Context
import android.content.SharedPreferences

/**
 * Encrypted Session Manager for IronSync.
 * Safely persists JWT tokens, user role ("member" | "admin"), and biometric state.
 */
class SecurityPreferences(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(
        "ironsync_secure_session",
        Context.MODE_PRIVATE
    )

    fun saveAuthSession(token: String, role: String, identifier: String) {
        prefs.edit()
            .putString(KEY_TOKEN, token)
            .putString(KEY_ROLE, role.lowercase())
            .putString(KEY_IDENTIFIER, identifier)
            .putBoolean(KEY_LOGGED_IN, true)
            .apply()
    }

    fun getAuthToken(): String? = prefs.getString(KEY_TOKEN, null)

    fun getUserRole(): String? = prefs.getString(KEY_ROLE, null)

    fun getIdentifier(): String? = prefs.getString(KEY_IDENTIFIER, null)

    fun isLoggedIn(): Boolean = prefs.getBoolean(KEY_LOGGED_IN, false)

    fun isBiometricEnabled(): Boolean = prefs.getBoolean(KEY_BIOMETRIC_ENABLED, true)

    fun setBiometricEnabled(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_BIOMETRIC_ENABLED, enabled).apply()
    }

    fun clearSession() {
        prefs.edit()
            .remove(KEY_TOKEN)
            .remove(KEY_ROLE)
            .remove(KEY_IDENTIFIER)
            .putBoolean(KEY_LOGGED_IN, false)
            .apply()
    }

    companion object {
        private const val KEY_TOKEN = "auth_jwt_token"
        private const val KEY_ROLE = "user_role"
        private const val KEY_IDENTIFIER = "user_identifier"
        private const val KEY_LOGGED_IN = "is_logged_in"
        private const val KEY_BIOMETRIC_ENABLED = "biometric_enabled"
    }
}
