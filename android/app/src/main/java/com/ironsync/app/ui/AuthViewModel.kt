package com.ironsync.app.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.ironsync.app.data.AuthRepository
import com.ironsync.app.data.AuthResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class AuthUiState {
    object Idle : AuthUiState()
    object Loading : AuthUiState()
    data class Success(val role: String, val identifier: String) : AuthUiState()
    data class Error(val message: String) : AuthUiState()
}

class AuthViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = AuthRepository(application)

    private val _uiState = MutableStateFlow<AuthUiState>(AuthUiState.Idle)
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    private val _identifier = MutableStateFlow("")
    val identifier: StateFlow<String> = _identifier.asStateFlow()

    private val _password = MutableStateFlow("")
    val password: StateFlow<String> = _password.asStateFlow()

    init {
        // Auto-check existing session on app launch
        checkExistingSession()
    }

    fun onIdentifierChanged(newIdentifier: String) {
        _identifier.value = newIdentifier
        if (_uiState.value is AuthUiState.Error) {
            _uiState.value = AuthUiState.Idle
        }
    }

    fun onPasswordChanged(newPassword: String) {
        _password.value = newPassword
        if (_uiState.value is AuthUiState.Error) {
            _uiState.value = AuthUiState.Idle
        }
    }

    fun checkExistingSession() {
        if (repository.isLoggedIn()) {
            val role = repository.getSessionRole() ?: "member"
            val id = repository.getSavedIdentifier() ?: ""
            _uiState.value = AuthUiState.Success(role = role, identifier = id)
        }
    }

    fun authenticate() {
        val currentIdentifier = _identifier.value.trim()
        val currentPassword = _password.value.trim()

        if (currentIdentifier.isEmpty()) {
            _uiState.value = AuthUiState.Error("Please enter your Identifier (Email, Username, or Member ID).")
            return
        }

        if (currentPassword.isEmpty()) {
            _uiState.value = AuthUiState.Error("Please enter your Password or Security PIN.")
            return
        }

        _uiState.value = AuthUiState.Loading

        viewModelScope.launch {
            when (val result = repository.login(currentIdentifier, currentPassword)) {
                is AuthResult.Success -> {
                    _uiState.value = AuthUiState.Success(role = result.role, identifier = result.identifier)
                }
                is AuthResult.Error -> {
                    _uiState.value = AuthUiState.Error(result.message)
                }
            }
        }
    }

    fun authenticateWithBiometrics() {
        val savedId = repository.getSavedIdentifier()
        val savedRole = repository.getSessionRole()
        if (savedId != null && savedRole != null) {
            _uiState.value = AuthUiState.Success(role = savedRole, identifier = savedId)
        } else {
            _uiState.value = AuthUiState.Error("No stored session for Biometric Unlock. Please log in with credentials first.")
        }
    }

    fun resetState() {
        _uiState.value = AuthUiState.Idle
    }
}
