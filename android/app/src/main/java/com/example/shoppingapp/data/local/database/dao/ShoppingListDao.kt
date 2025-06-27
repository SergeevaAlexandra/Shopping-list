package com.example.shoppingapp.data.local.database.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.shoppingapp.data.local.database.entities.ShoppingListEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ShoppingListDao {
    @Query("SELECT * FROM shopping_lists WHERE userId = :userId ORDER BY createdAt DESC")
    fun getUserLists(userId: Long): Flow<List<ShoppingListEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertList(list: ShoppingListEntity): Long

    @Query("SELECT * FROM shopping_lists WHERE id = :listId")
    suspend fun getListById(listId: Long): ShoppingListEntity?

    @Delete
    suspend fun deleteList(list: ShoppingListEntity)

    @Query("SELECT * FROM shopping_lists WHERE name = :name AND userId = :userId LIMIT 1")
    suspend fun getListByNameAndUserId(name: String, userId: Long): ShoppingListEntity?

    @Query("DELETE FROM shopping_lists WHERE id = :listId")
    suspend fun deleteListById(listId: Long)
}