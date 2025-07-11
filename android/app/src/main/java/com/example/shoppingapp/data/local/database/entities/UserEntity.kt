package com.example.shoppingapp.data.local.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val login: String,
    val password: String
)