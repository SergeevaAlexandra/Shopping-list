package com.example.shoppingapp.data.local.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import com.example.shoppingapp.data.local.database.dao.ItemDao
import com.example.shoppingapp.data.local.database.dao.ShoppingListDao
import com.example.shoppingapp.data.local.database.dao.UserDao
import com.example.shoppingapp.data.local.database.entities.ItemEntity
import com.example.shoppingapp.data.local.database.entities.ShoppingListEntity
import com.example.shoppingapp.data.local.database.entities.UserEntity
import java.util.Date

@Database(
    entities = [UserEntity::class, ShoppingListEntity::class, ItemEntity::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(DateConverter::class)
abstract class ShoppingDatabase : RoomDatabase() {

    abstract fun userDao(): UserDao
    abstract fun shoppingListDao(): ShoppingListDao
    abstract fun itemDao(): ItemDao

    companion object {
        @Volatile
        private var INSTANCE: ShoppingDatabase? = null

        fun getDatabase(context: Context): ShoppingDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    ShoppingDatabase::class.java,
                    "shopping_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}

class DateConverter {
    @TypeConverter
    fun fromTimestamp(value: Long?): Date? {
        return value?.let { Date(it) }
    }

    @TypeConverter
    fun dateToTimestamp(date: Date?): Long? {
        return date?.time
    }
}