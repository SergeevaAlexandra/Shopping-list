package com.example.shoppingapp.ui.screens.profile

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.compose.material3.CircularProgressIndicator

@Composable
fun ProfileScreen(
    viewModel: ProfileViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val login by viewModel.loginInput.collectAsState()
    val password by viewModel.passwordInput.collectAsState()
    val isLoading = uiState.isLoading

    val textFieldColors = OutlinedTextFieldDefaults.colors(
        focusedBorderColor = MaterialTheme.colorScheme.outline,
        unfocusedBorderColor = MaterialTheme.colorScheme.outline,
        cursorColor = MaterialTheme.colorScheme.primary
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 24.dp, vertical = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Профиль",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 32.dp)
        )

        if (!uiState.isLoggedIn) {

            Column(modifier = Modifier.fillMaxWidth()) {
                if (!isLoading) {
                    OutlinedTextField(
                        value = login,
                        onValueChange = viewModel::updateLogin,
                        label = { Text("Логин") },
                        singleLine = true,
                        colors = myTextFieldColors(),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp)
                    )
                    OutlinedTextField(
                        value = password,
                        onValueChange = viewModel::updatePassword,
                        label = { Text("Пароль") },
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation(),
                        colors = myTextFieldColors(),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 24.dp)
                    )
                } else {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(136.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(48.dp),
                            color = MaterialTheme.colorScheme.primary,
                            strokeWidth = 4.dp,
                            trackColor = Color.LightGray
                        )

                    }
                }

                val buttonColors = ButtonDefaults.buttonColors(
                    containerColor = Color.Black,
                    contentColor = Color.Black,
                    disabledContainerColor = Color.Black,
                    disabledContentColor = Color.Black
                )

                Button(
                    onClick = viewModel::login,
                    enabled = !isLoading,
                    shape = RoundedCornerShape(12.dp),
                    colors = buttonColors,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .padding(bottom = 12.dp)
                ) {
                    Text("Войти", color = Color.White)
                }

                Button(
                    onClick = viewModel::register,
                    enabled = !isLoading,
                    shape = RoundedCornerShape(12.dp),
                    colors = buttonColors,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .padding(bottom = 12.dp)
                ) {
                    Text("Зарегистрироваться", color = Color.White)
                }

                uiState.errorMessage?.let { error ->
                    Text(
                        text = error,
                        color = MaterialTheme.colorScheme.error,
                        modifier = Modifier.padding(top = 16.dp)
                    )
                }
            }
        } else {
            Spacer(modifier = Modifier.height(16.dp))
            Icon(
                imageVector = Icons.Default.AccountCircle,
                contentDescription = null,
                tint = Color.Black,
                modifier = Modifier.size(120.dp)
            )
            Text(
                text = viewModel.currentUser?.login.orEmpty(),
                style = MaterialTheme.typography.headlineSmall.copy(fontSize = 24.sp),
                modifier = Modifier.padding(top = 16.dp, bottom = 32.dp)
            )

            Button(
                onClick = viewModel::logout,
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.Black),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .padding(bottom = 12.dp)
            ) {
                Text("Выйти", color = Color.White)
            }

            Button(
                onClick = viewModel::logout,
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.Black),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .padding(bottom = 12.dp)
            ) {
                Text("Удалить аккаунт", color = Color.White)
            }
        }
    }
}

@Composable
fun myTextFieldColors() = OutlinedTextFieldDefaults.colors(
    focusedBorderColor = Color.Black,
    unfocusedBorderColor = Color.Gray,
    cursorColor = Color.Black,
    focusedLabelColor = Color.Black,
    unfocusedLabelColor = Color.DarkGray,
)