package com.example.shoppingapp.di

import android.content.Context
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.shoppingapp.data.local.database.ShoppingDatabase
import com.example.shoppingapp.data.local.database.dao.ItemDao
import com.example.shoppingapp.data.local.database.dao.ShoppingListDao
import com.example.shoppingapp.data.local.database.dao.UserDao
import com.example.shoppingapp.data.local.database.entities.UserEntity
import dagger.Provides
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import javax.inject.Provider
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideAppDatabase(
        @ApplicationContext context: Context,
        userDaoProvider: Provider<UserDao> // Используем Provider!
    ): ShoppingDatabase {
        return Room.databaseBuilder(
            context,
            ShoppingDatabase::class.java,
            "shopping_database"
        )
            .addCallback(object : RoomDatabase.Callback() {
                override fun onCreate(db: SupportSQLiteDatabase) {
                    super.onCreate(db)

                    // Добавляем гостевого пользователя при первом создании базы
                    CoroutineScope(Dispatchers.IO).launch {
                        val guestUser = UserEntity(login = "guest", password = "guest")
                        userDaoProvider.get().insertUser(guestUser)
                    }
                }
            })
            .fallbackToDestructiveMigration() // если ты ещё не используешь миграции
            .build()
    }

    @Provides
    fun provideUserDao(database: ShoppingDatabase): UserDao = database.userDao()

    @Provides
    fun provideShoppingListDao(database: ShoppingDatabase): ShoppingListDao = database.shoppingListDao()

    @Provides
    fun provideItemDao(database: ShoppingDatabase): ItemDao = database.itemDao()
}
