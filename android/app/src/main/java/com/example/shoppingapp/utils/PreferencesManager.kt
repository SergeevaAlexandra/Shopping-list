package com.example.shoppingapp.utils

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.first
import javax.inject.Inject
import javax.inject.Singleton

// Расширение для создания DataStore
private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

@Singleton
class PreferencesManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val dataStore = context.dataStore

    // Ключи для хранения данных
    private val LOGIN_KEY = stringPreferencesKey("login")
    private val PASSWORD_KEY = stringPreferencesKey("password")

    // Сохранение данных пользователя
    suspend fun saveUserCredentials(login: String, password: String) {
        dataStore.edit { preferences ->
            preferences[LOGIN_KEY] = login
            preferences[PASSWORD_KEY] = password
        }
    }

    // Получение сохраненных данных
    suspend fun getUserCredentials(): Pair<String?, String?> {
        val preferences = dataStore.data.first()
        return Pair(
            preferences[LOGIN_KEY],
            preferences[PASSWORD_KEY]
        )
    }

    // Очистка данных
    suspend fun clearUserCredentials() {
        dataStore.edit { preferences ->
            preferences.clear()
        }
    }
}