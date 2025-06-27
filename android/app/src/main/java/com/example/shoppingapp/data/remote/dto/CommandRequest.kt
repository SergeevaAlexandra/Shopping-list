package com.example.shoppingapp.data.remote.dto

data class CommandRequest(
    val login: String,
    val password: String,
    val command: Int,
    val args: String
)