package com.example.shoppingapp.ui.screens.lists

import com.example.shoppingapp.data.models.ShoppingList

data class ListsUiState(
    val lists: List<ShoppingList> = emptyList(),
    val isLoading: Boolean = false,
    val showCreateDialog: Boolean = false,
    val errorMessage: String? = null
)