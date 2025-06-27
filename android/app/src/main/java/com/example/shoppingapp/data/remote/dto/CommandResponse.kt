package com.example.shoppingapp.data.remote.dto

data class CommandResponse(
    val code: Int,
    val n: Int? = null,
    val data: List<String>? = null
)