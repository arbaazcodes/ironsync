package com.ironsync.app.ui

import android.R
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.text.InputType
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.widget.*
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.ironsync.app.MainActivity
import com.ironsync.app.theme.IronSyncColors
import com.ironsync.app.utils.BiometricAuthManager
import kotlinx.coroutines.flow.collect

/**
 * IronSync Unified Mobile Login Screen Activity.
 * Serves as the mandatory first launch screen.
 */
class LoginScreenActivity : AppCompatActivity() {

    private val viewModel: AuthViewModel by viewModels()
    private lateinit var biometricManager: BiometricAuthManager

    private lateinit var identifierInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var ctaButton: Button
    private lateinit var biometricButton: ImageButton
    private lateinit var errorTextView: TextView
    private lateinit var progressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        biometricManager = BiometricAuthManager(this)

        // Build programmatic UI layout using IronSync dark theme
        val rootLayout = buildLayout()
        setContentView(rootLayout)

        // Observe ViewModel UI state
        lifecycleScope.launchWhenStarted {
            viewModel.uiState.collect { state ->
                renderUiState(state)
            }
        }
    }

    private fun buildLayout(): View {
        val context = this

        val scroll = ScrollView(context).apply {
            setBackgroundColor(IronSyncColors.COLOR_BG)
            isFillViewport = true
        }

        val container = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dpToPx(24), dpToPx(48), dpToPx(24), dpToPx(32))
            gravity = Gravity.CENTER_HORIZONTAL
        }

        // Header Logo & Branding
        val logoLayout = LinearLayout(context).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(0, dpToPx(16), 0, dpToPx(24))
        }

        val logoIcon = TextView(context).apply {
            text = "⚡"
            textSize = 24f
            setPadding(dpToPx(12), dpToPx(10), dpToPx(12), dpToPx(10))
            background = GradientDrawable().apply {
                setColor(IronSyncColors.COLOR_ACCENT_CRIMSON)
                cornerRadius = dpToPx(16).toFloat()
            }
        }

        val logoText = TextView(context).apply {
            text = "IRONSYNC"
            textSize = 22f
            setTextColor(IronSyncColors.COLOR_TEXT_PRIMARY)
            typeface = Typeface.DEFAULT_BOLD
            setPadding(dpToPx(14), 0, 0, 0)
        }

        logoLayout.addView(logoIcon)
        logoLayout.addView(logoText)
        container.addView(logoLayout)

        // Title & Subtitle
        val titleView = TextView(context).apply {
            text = "Welcome to IronSync"
            textSize = 26f
            setTextColor(IronSyncColors.COLOR_TEXT_PRIMARY)
            typeface = Typeface.DEFAULT_BOLD
            setPadding(0, dpToPx(12), 0, dpToPx(4))
        }
        val subtitleView = TextView(context).apply {
            text = "Enter your credentials to Sync In"
            textSize = 13f
            setTextColor(IronSyncColors.COLOR_TEXT_SECONDARY)
            setPadding(0, 0, 0, dpToPx(28))
        }
        container.addView(titleView)
        container.addView(subtitleView)

        // Error Banner
        errorTextView = TextView(context).apply {
            textSize = 12f
            setTextColor(Color.parseColor("#FF6B6B"))
            setBackgroundColor(Color.parseColor("#2A1215"))
            setPadding(dpToPx(12), dpToPx(10), dpToPx(12), dpToPx(10))
            visibility = View.GONE
            gravity = Gravity.CENTER
        }
        container.addView(errorTextView)

        // Field 1: Identifier (Email / Username / Member ID)
        val identifierLabel = TextView(context).apply {
            text = "IDENTIFIER"
            textSize = 11f
            setTextColor(IronSyncColors.COLOR_TEXT_SECONDARY)
            typeface = Typeface.DEFAULT_BOLD
            setPadding(0, dpToPx(12), 0, dpToPx(6))
        }
        identifierInput = EditText(context).apply {
            hint = "Email, Username, or Member ID (IS-XXXX)"
            setHintTextColor(IronSyncColors.COLOR_TEXT_MUTED)
            setTextColor(IronSyncColors.COLOR_TEXT_PRIMARY)
            textSize = 14f
            setPadding(dpToPx(16), dpToPx(14), dpToPx(16), dpToPx(14))
            inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS
            background = GradientDrawable().apply {
                setColor(IronSyncColors.COLOR_SURFACE_1)
                setStroke(dpToPx(1), IronSyncColors.COLOR_BORDER_SUBTLE)
                cornerRadius = dpToPx(12).toFloat()
            }
        }
        container.addView(identifierLabel)
        container.addView(identifierInput)

        // Field 2: Password / PIN
        val passwordLabel = TextView(context).apply {
            text = "PASSWORD"
            textSize = 11f
            setTextColor(IronSyncColors.COLOR_TEXT_SECONDARY)
            typeface = Typeface.DEFAULT_BOLD
            setPadding(0, dpToPx(16), 0, dpToPx(6))
        }
        passwordInput = EditText(context).apply {
            hint = "Password or Security PIN"
            setHintTextColor(IronSyncColors.COLOR_TEXT_MUTED)
            setTextColor(IronSyncColors.COLOR_TEXT_PRIMARY)
            textSize = 14f
            setPadding(dpToPx(16), dpToPx(14), dpToPx(16), dpToPx(14))
            inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
            background = GradientDrawable().apply {
                setColor(IronSyncColors.COLOR_SURFACE_1)
                setStroke(dpToPx(1), IronSyncColors.COLOR_BORDER_SUBTLE)
                cornerRadius = dpToPx(12).toFloat()
            }
        }
        container.addView(passwordLabel)
        container.addView(passwordInput)

        // Forgot Password Action
        val forgotPassword = TextView(context).apply {
            text = "Forgot Password?"
            textSize = 12f
            setTextColor(IronSyncColors.COLOR_ACCENT_AMBER)
            setPadding(0, dpToPx(12), 0, dpToPx(20))
            gravity = Gravity.END
            setOnClickListener {
                Toast.makeText(context, "Password reset instruction sent to registered email.", Toast.LENGTH_LONG).show()
            }
        }
        container.addView(forgotPassword)

        // Progress Bar
        progressBar = ProgressBar(context).apply {
            visibility = View.GONE
        }
        container.addView(progressBar)

        // Action Row: Primary CTA + Biometric Trigger
        val actionRow = LinearLayout(context).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(0, dpToPx(8), 0, 0)
        }

        ctaButton = Button(context).apply {
            text = "SYNC IN"
            textSize = 14f
            setTextColor(Color.WHITE)
            typeface = Typeface.DEFAULT_BOLD
            setPadding(dpToPx(20), dpToPx(14), dpToPx(20), dpToPx(14))
            background = GradientDrawable().apply {
                setColor(IronSyncColors.COLOR_ACCENT_CRIMSON)
                cornerRadius = dpToPx(14).toFloat()
            }
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1.0f)
            setOnClickListener {
                val id = identifierInput.text.toString()
                val pass = passwordInput.text.toString()
                viewModel.onIdentifierChanged(id)
                viewModel.onPasswordChanged(pass)
                viewModel.authenticate()
            }
        }

        biometricButton = ImageButton(context).apply {
            setImageResource(R.drawable.ic_lock_lock)
            setColorFilter(IronSyncColors.COLOR_ACCENT_AMBER)
            background = GradientDrawable().apply {
                setColor(IronSyncColors.COLOR_SURFACE_2)
                setStroke(dpToPx(1), IronSyncColors.COLOR_ACCENT_AMBER)
                cornerRadius = dpToPx(14).toFloat()
            }
            setPadding(dpToPx(14), dpToPx(14), dpToPx(14), dpToPx(14))
            layoutParams = LinearLayout.LayoutParams(dpToPx(52), dpToPx(52)).apply {
                setMargins(dpToPx(12), 0, 0, 0)
            }
            setOnClickListener {
                if (biometricManager.canAuthenticate()) {
                    biometricManager.promptBiometric(
                        activity = this@LoginScreenActivity,
                        onSuccess = {
                            viewModel.authenticateWithBiometrics()
                        },
                        onError = { err ->
                            Toast.makeText(context, err, Toast.LENGTH_SHORT).show()
                        }
                    )
                } else {
                    Toast.makeText(context, "Biometric authentication unavailable.", Toast.LENGTH_SHORT).show()
                }
            }
        }

        actionRow.addView(ctaButton)
        actionRow.addView(biometricButton)
        container.addView(actionRow)

        // Footer Meta
        val footerText = TextView(context).apply {
            text = "IronSync Mobile Platform · Encrypted Session"
            textSize = 10f
            setTextColor(IronSyncColors.COLOR_TEXT_MUTED)
            gravity = Gravity.CENTER
            setPadding(0, dpToPx(36), 0, 0)
        }
        container.addView(footerText)

        scroll.addView(container)
        return scroll
    }

    private fun renderUiState(state: AuthUiState) {
        when (state) {
            is AuthUiState.Idle -> {
                progressBar.visibility = View.GONE
                ctaButton.isEnabled = true
                errorTextView.visibility = View.GONE
            }
            is AuthUiState.Loading -> {
                progressBar.visibility = View.VISIBLE
                ctaButton.isEnabled = false
                errorTextView.visibility = View.GONE
            }
            is AuthUiState.Success -> {
                progressBar.visibility = View.GONE
                ctaButton.isEnabled = true
                errorTextView.visibility = View.GONE

                // Route behind the scenes based on user role
                navigateToDashboard(state.role, state.identifier)
            }
            is AuthUiState.Error -> {
                progressBar.visibility = View.GONE
                ctaButton.isEnabled = true
                errorTextView.text = state.message
                errorTextView.visibility = View.VISIBLE
            }
        }
    }

    private fun navigateToDashboard(role: String, identifier: String) {
        val intent = Intent(this, MainActivity::class.java).apply {
            putExtra("EXTRA_ROLE", role)
            putExtra("EXTRA_IDENTIFIER", identifier)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        startActivity(intent)
        finish()
    }

    private fun dpToPx(dp: Int): Int {
        return TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            dp.toFloat(),
            resources.displayMetrics
        ).toInt()
    }
}
