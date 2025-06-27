package com.example.shoppingapp.ui.screens.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.shoppingapp.data.repository.ShoppingRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val repository: ShoppingRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    private val _loginInput = MutableStateFlow("")
    val loginInput: StateFlow<String> = _loginInput.asStateFlow()

    private val _passwordInput = MutableStateFlow("")
    val passwordInput: StateFlow<String> = _passwordInput.asStateFlow()

    val currentUser get() = repository.currentUser.value

    init {
        viewModelScope.launch {
            repository.currentUser.collect { user ->
                if (user != null) {
                    _uiState.value = _uiState.value.copy(isLoggedIn = true, errorMessage = null)
                }
            }
        }
    }

    fun updateLogin(newLogin: String) {
        _loginInput.value = newLogin
    }

    fun updatePassword(newPassword: String) {
        _passwordInput.value = newPassword
    }

    fun login() {
        if (_loginInput.value.isBlank() || _passwordInput.value.isBlank()) {
            _uiState.value = _uiState.value.copy(errorMessage = "Заполните все поля")
            return
        }
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            val result = repository.login(_loginInput.value, _passwordInput.value)
            if (result.isSuccess) {
                _uiState.value = _uiState.value.copy(isLoading = false, isLoggedIn = true, errorMessage = null)
            } else {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = result.exceptionOrNull()?.message ?: "Ошибка авторизации"
                )
            }
        }
    }

    fun register() {
        if (_loginInput.value.isBlank() || _passwordInput.value.isBlank()) {
            _uiState.value = _uiState.value.copy(errorMessage = "Заполните все поля")
            return
        }
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            val result = repository.register(_loginInput.value, _passwordInput.value)
            if (result.isSuccess) {
                _uiState.value = _uiState.value.copy(isLoading = false, isLoggedIn = true, errorMessage = null)
                // TODO: Перенести локальные данные на сервер (списки и товары)
            } else {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = result.exceptionOrNull()?.message ?: "Ошибка регистрации"
                )
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            repository.logout()
            _uiState.value = AuthUiState(isLoggedIn = false)
            _loginInput.value = ""
            _passwordInput.value = ""
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(errorMessage = null)
    }
}