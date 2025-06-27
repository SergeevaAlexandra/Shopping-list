package com.example.shoppingapp.ui.screens.lists

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.shoppingapp.data.repository.ShoppingRepository
import com.example.shoppingapp.utils.PreferencesManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import kotlinx.coroutines.Job
import javax.inject.Inject

@HiltViewModel
class ListsViewModel @Inject constructor(
    private val repository: ShoppingRepository,
    private val preferencesManager: PreferencesManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(ListsUiState())
    val uiState: StateFlow<ListsUiState> = _uiState.asStateFlow()

    private val _newListName = MutableStateFlow("")
    val newListName: StateFlow<String> = _newListName.asStateFlow()

    private var listsCollectionJob: Job? = null

    init {
        loadUserLists()
    }

    private fun loadUserLists() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

            try {
                val (login, pass) = preferencesManager.getUserCredentials()
                if (!login.isNullOrBlank() && !pass.isNullOrBlank()) {
                    repository.login(login, pass)
                }

                listsCollectionJob?.cancel()

                listsCollectionJob = launch {
                    repository.currentUser
                        .filterNotNull()
                        .flatMapLatest { user ->
                            repository.getUserShoppingLists(user.id)
                        }
                        .catch { exception ->
                            _uiState.value = _uiState.value.copy(
                                isLoading = false,
                                errorMessage = "Ошибка загрузки списков: ${exception.message}"
                            )
                        }
                        .collect { lists ->
                            _uiState.value = _uiState.value.copy(
                                lists = lists,
                                isLoading = false,
                                errorMessage = null
                            )
                        }
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = "Ошибка инициализации: ${e.message}"
                )
            }
        }

        viewModelScope.launch {
            repository.currentUser
                .filter { it == null }
                .collect {
                    _uiState.value = _uiState.value.copy(
                        lists = emptyList(),
                        isLoading = false
                    )
                }
        }
    }

    fun showCreateDialog() {
        _uiState.value = _uiState.value.copy(showCreateDialog = true)
    }

    fun hideCreateDialog() {
        _uiState.value = _uiState.value.copy(showCreateDialog = false)
        _newListName.value = ""
    }

    fun updateNewListName(name: String) {
        _newListName.value = name
    }

    fun createList() {
        val listName = _newListName.value.trim()
        if (listName.isBlank()) {
            _uiState.value = _uiState.value.copy(errorMessage = "Введите название списка")
            return
        }

        val user = repository.currentUser.value
        if (user == null) {
            _uiState.value = _uiState.value.copy(
                errorMessage = "Необходимо войти в систему для создания списка"
            )
            return
        }

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)

            try {
                val result = repository.createShoppingList(listName, user.id)
                if (result.isSuccess) {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        showCreateDialog = false
                    )
                    _newListName.value = ""
                } else {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        errorMessage = result.exceptionOrNull()?.message ?: "Ошибка создания списка"
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = "Неожиданная ошибка: ${e.message}"
                )
            }
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(errorMessage = null)
    }

    override fun onCleared() {
        super.onCleared()
        listsCollectionJob?.cancel()
    }
}