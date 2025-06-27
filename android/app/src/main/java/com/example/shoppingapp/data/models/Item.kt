package com.example.shoppingapp.data.models

data class Item(
    val id: Long = 0,
    val name: String,
    val quantity: Int,
    val listId: Long,
    val isCompleted: Boolean = false
)