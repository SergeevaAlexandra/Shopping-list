package com.example.shoppingapp.data.repository

import com.example.shoppingapp.data.local.database.dao.ItemDao
import com.example.shoppingapp.data.local.database.dao.ShoppingListDao
import com.example.shoppingapp.data.local.database.dao.UserDao
import com.example.shoppingapp.data.local.database.entities.ItemEntity
import com.example.shoppingapp.data.local.database.entities.ShoppingListEntity
import com.example.shoppingapp.data.local.database.entities.UserEntity
import com.example.shoppingapp.data.models.Item
import com.example.shoppingapp.data.models.ShoppingList
import com.example.shoppingapp.data.models.User
import com.example.shoppingapp.data.remote.api.ApiService
import com.example.shoppingapp.data.remote.dto.CommandRequest
import com.example.shoppingapp.utils.Constants
import com.example.shoppingapp.utils.PreferencesManager
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ShoppingRepository @Inject constructor(
    private val apiService: ApiService,
    private val userDao: UserDao,
    private val shoppingListDao: ShoppingListDao,
    private val itemDao: ItemDao,
    private val preferencesManager: PreferencesManager
) {

    private val _currentUser = MutableStateFlow<User?>(null)
    val currentUser = _currentUser.asStateFlow()

    suspend fun login(login: String, password: String): Result<User> {
        return try {
            val response = apiService.executeCommand(
                CommandRequest(login, password, Constants.Commands.GET_LISTS, "")
            )

            if (response.isSuccessful && response.body()?.code == Constants.ResponseCodes.SUCCESS) {
                val userEntity = UserEntity(login = login, password = password)
                val userId = userDao.insertUser(userEntity)

                val user = User(id = userId, login = login, password = password)
                _currentUser.value = user

                preferencesManager.saveUserCredentials(login, password)

                Result.success(user)
            } else {
                Result.failure(Exception("Неверный логин или пароль"))
            }
        } catch (e: Exception) {
            val localUser = userDao.getUser(login, password)
            if (localUser != null) {
                val user = User(localUser.id, localUser.login, localUser.password)
                _currentUser.value = user
                Result.success(user)
            } else {
                Result.failure(e)
            }
        }
    }

    suspend fun register(login: String, password: String): Result<User> {
        return try {
            val response = apiService.executeCommand(
                CommandRequest(login, password, Constants.Commands.GET_LISTS, "")
            )

            if (response.isSuccessful && response.body()?.code == Constants.ResponseCodes.SUCCESS) {
                val userEntity = UserEntity(login = login, password = password)
                val userId = userDao.insertUser(userEntity)

                val user = User(id = userId, login = login, password = password)
                _currentUser.value = user
                preferencesManager.saveUserCredentials(login, password)

                Result.success(user)
            } else {
                registerLocally(login, password)
            }
        } catch (e: Exception) {
            registerLocally(login, password)
        }
    }

    private suspend fun registerLocally(login: String, password: String): Result<User> {
        val existingUser = userDao.getUser(login, password)
        if (existingUser != null) {
            return Result.failure(Exception("Пользователь уже существует"))
        }

        val userEntity = UserEntity(login = login, password = password)
        val userId = userDao.insertUser(userEntity)

        val user = User(id = userId, login = login, password = password)
        _currentUser.value = user
        preferencesManager.saveUserCredentials(login, password)

        return Result.success(user)
    }

    suspend fun logout() {
        _currentUser.value = null
        preferencesManager.clearUserCredentials()
    }

    fun getUserShoppingLists(userId: Long): Flow<List<ShoppingList>> {
        return shoppingListDao.getUserLists(userId).map { entities ->
            entities.map { entity ->
                ShoppingList(
                    id = entity.id,
                    name = entity.name,
                    userId = entity.userId,
                    createdAt = entity.createdAt
                )
            }
        }
    }

    suspend fun syncShoppingLists(): Result<Unit> {
        return try {
            val user = _currentUser.value
            if (user != null) {
                val response = apiService.executeCommand(
                    CommandRequest(user.login, user.password, Constants.Commands.GET_LISTS, "")
                )

                if (response.isSuccessful) {
                    val body = response.body()
                    if (body?.code == Constants.ResponseCodes.SUCCESS && body.data != null) {
                        val serverLists = body.data.map { listName ->
                            ShoppingListEntity(name = listName, userId = user.id)
                        }

                        serverLists.forEach { serverList ->
                            val existingList =
                                shoppingListDao.getListByNameAndUserId(serverList.name, user.id)
                            if (existingList == null) {
                                shoppingListDao.insertList(serverList)
                            }
                        }
                    }
                }
                Result.success(Unit)
            } else {
                Result.failure(Exception("Пользователь не авторизован"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createShoppingList(name: String, userId: Long): Result<ShoppingList> {
        return try {
            val user = _currentUser.value
            if (user != null) {
                val response = apiService.executeCommand(
                    CommandRequest(
                        user.login,
                        user.password,
                        Constants.Commands.ADD_ITEM,
                        "$name,placeholder,1"
                    )
                )

                if (response.isSuccessful && response.body()?.code == Constants.ResponseCodes.SUCCESS) {
                    apiService.executeCommand(
                        CommandRequest(
                            user.login,
                            user.password,
                            Constants.Commands.DELETE_ITEM,
                            "$name,placeholder,1"
                        )
                    )
                }

                val listEntity = ShoppingListEntity(name = name, userId = userId)
                val listId = shoppingListDao.insertList(listEntity)

                val newList = ShoppingList(id = listId, name = name, userId = userId)
                Result.success(newList)
            } else {
                Result.failure(Exception("Пользователь не авторизован"))
            }
        } catch (e: Exception) {
            val listEntity = ShoppingListEntity(name = name, userId = userId)
            val listId = shoppingListDao.insertList(listEntity)
            val newList = ShoppingList(id = listId, name = name, userId = userId)
            Result.success(newList)
        }
    }

    suspend fun deleteShoppingList(listId: Long): Result<Unit> {
        return try {
            val user = _currentUser.value
            val shoppingList = shoppingListDao.getListById(listId)

            if (user != null && shoppingList != null) {
                val response = apiService.executeCommand(
                    CommandRequest(
                        user.login,
                        user.password,
                        Constants.Commands.DELETE_LIST,
                        shoppingList.name
                    )
                )

                shoppingListDao.deleteListById(listId)
                itemDao.deleteItemsByListId(listId)

                Result.success(Unit)
            } else {
                Result.failure(Exception("Список не найден"))
            }
        } catch (e: Exception) {
            shoppingListDao.deleteListById(listId)
            itemDao.deleteItemsByListId(listId)
            Result.success(Unit)
        }
    }

    fun getItemsInList(listId: Long): Flow<List<Item>> {
        return itemDao.getItemsByListId(listId).map { entities ->
            entities.map { entity ->
                Item(
                    id = entity.id,
                    name = entity.name,
                    quantity = entity.quantity,
                    listId = entity.listId,
                    isCompleted = entity.isCompleted
                )
            }
        }
    }

    suspend fun syncItemsInList(listId: Long): Result<Unit> {
        return try {
            val user = _currentUser.value
            val shoppingList = shoppingListDao.getListById(listId)

            if (user != null && shoppingList != null) {
                val response = apiService.executeCommand(
                    CommandRequest(
                        user.login,
                        user.password,
                        Constants.Commands.GET_ITEMS,
                        shoppingList.name
                    )
                )

                if (response.isSuccessful) {
                    val body = response.body()
                    if (body?.code == Constants.ResponseCodes.SUCCESS && body.data != null) {
                        val serverItems = body.data.mapNotNull { itemString ->
                            val parts = itemString.split(":")
                            if (parts.size == 2) {
                                val name = parts[0]
                                val quantity = parts[1].toIntOrNull() ?: 1
                                ItemEntity(name = name, quantity = quantity, listId = listId)
                            } else null
                        }

                        serverItems.forEach { serverItem ->
                            val existingItem =
                                itemDao.getItemByNameAndListId(serverItem.name, listId)
                            if (existingItem == null) {
                                itemDao.insertItem(serverItem)
                            }
                        }
                    }
                }
                Result.success(Unit)
            } else {
                Result.failure(Exception("Список не найден"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun addItemToList(name: String, quantity: Int, listId: Long): Result<Item> {
        return try {
            val user = _currentUser.value
            val shoppingList = shoppingListDao.getListById(listId)

            if (user != null && shoppingList != null) {
                val args = "${shoppingList.name},$name,$quantity"

                val response = apiService.executeCommand(
                    CommandRequest(user.login, user.password, Constants.Commands.ADD_ITEM, args)
                )

                val itemEntity = ItemEntity(
                    name = name,
                    quantity = quantity,
                    listId = listId
                )
                val itemId = itemDao.insertItem(itemEntity)

                val newItem = Item(id = itemId, name = name, quantity = quantity, listId = listId)
                Result.success(newItem)
            } else {
                Result.failure(Exception("Ошибка при добавлении товара"))
            }
        } catch (e: Exception) {
            val itemEntity = ItemEntity(name = name, quantity = quantity, listId = listId)
            val itemId = itemDao.insertItem(itemEntity)
            val newItem = Item(id = itemId, name = name, quantity = quantity, listId = listId)
            Result.success(newItem)
        }
    }

    suspend fun deleteItemFromList(itemId: Long): Result<Unit> {
        return try {
            val user = _currentUser.value
            val item = itemDao.getItemById(itemId)
            val shoppingList = if (item != null) shoppingListDao.getListById(item.listId) else null

            if (user != null && item != null && shoppingList != null) {
                val args = "${shoppingList.name},${item.name},${item.quantity}"

                val response = apiService.executeCommand(
                    CommandRequest(user.login, user.password, Constants.Commands.DELETE_ITEM, args)
                )

                itemDao.deleteItemById(itemId)

                Result.success(Unit)
            } else {
                Result.failure(Exception("Товар не найден"))
            }
        } catch (e: Exception) {
            itemDao.deleteItemById(itemId)
            Result.success(Unit)
        }
    }

    suspend fun getShoppingListById(id: Long): ShoppingList? {
        val entity = shoppingListDao.getListById(id)
        return entity?.let {
            ShoppingList(
                id = it.id,
                name = it.name,
                userId = it.userId,
                createdAt = it.createdAt
            )
        }
    }
}