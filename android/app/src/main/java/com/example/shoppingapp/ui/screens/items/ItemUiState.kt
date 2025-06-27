package com.example.shoppingapp.ui.screens.items

import com.example.shoppingapp.data.models.Item

data class ItemsUiState(
    val listName: String = "",
    val items: List<Item> = emptyList(),
    val isLoading: Boolean = false,
    val showAddDialog: Boolean = false,
    val errorMessage: String? = null
)