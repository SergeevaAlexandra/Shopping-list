package com.example.shoppingapp.ui.screens.items

import androidx.lifecycle.SavedStateHandle
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
class ItemsViewModel @Inject constructor(
    private val repository: ShoppingRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val listId: Long = savedStateHandle.get<Long>("listId") ?: 0L

    private val _uiState = MutableStateFlow(ItemsUiState())
    val uiState: StateFlow<ItemsUiState> = _uiState.asStateFlow()

    private val _newItemName = MutableStateFlow("")
    val newItemName: StateFlow<String> = _newItemName.asStateFlow()

    private val _newItemQuantity = MutableStateFlow("")
    val newItemQuantity: StateFlow<String> = _newItemQuantity.asStateFlow()

    init {
        viewModelScope.launch {
            val list = repository.getShoppingListById(listId)
            if (list != null) {
                _uiState.value = _uiState.value.copy(listName = list.name)
            }
        }
        loadItems()
    }

    private fun loadItems() {
        viewModelScope.launch {
            repository.getItemsInList(listId).collect { items ->
                _uiState.value = _uiState.value.copy(
                    items = items,
                    isLoading = false
                )
            }
        }
    }

    fun showAddDialog() {
        _uiState.value = _uiState.value.copy(showAddDialog = true)
    }

    fun hideAddDialog() {
        _uiState.value = _uiState.value.copy(showAddDialog = false)
        _newItemName.value = ""
        _newItemQuantity.value = ""
    }

    fun updateNewItemName(name: String) {
        _newItemName.value = name
    }

    fun updateNewItemQuantity(quantity: String) {
        _newItemQuantity.value = quantity
    }

    fun addItem() {
        if (_newItemName.value.isBlank()) {
            _uiState.value = _uiState.value.copy(errorMessage = "Введите название товара")
            return
        }
        val quantity = _newItemQuantity.value.toIntOrNull() ?: 1
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            val result = repository.addItemToList(_newItemName.value, quantity, listId)
            if (result.isSuccess) {
                _uiState.value = _uiState.value.copy(isLoading = false, showAddDialog = false)
                _newItemName.value = ""
                _newItemQuantity.value = ""
            } else {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = result.exceptionOrNull()?.message ?: "Ошибка добавления товара"
                )
            }
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(errorMessage = null)
    }
}