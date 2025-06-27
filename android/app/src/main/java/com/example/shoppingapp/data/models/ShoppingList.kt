package com.example.shoppingapp.data.models

data class ShoppingList(
    val id: Long = 0,
    val name: String,
    val userId: Long,
    val createdAt: Long = System.currentTimeMillis()
)