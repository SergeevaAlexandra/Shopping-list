package com.example.shoppingapp.ui.screens.lists

import android.util.Log
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.hilt.navigation.compose.hiltViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ListsScreen(
    onNavigateToItems: (Long) -> Unit,
    viewModel: ListsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val newListName by viewModel.newListName.collectAsState()

    Column(modifier = Modifier.fillMaxSize()) {
        CustomTopBar("Мои списки")

        Box(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                if (uiState.lists.isEmpty() && !uiState.isLoading) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "У вас пока нет списков покупок",
                            style = MaterialTheme.typography.bodyLarge,
                            textAlign = TextAlign.Center
                        )
                    }
                } else {
                    LazyColumn {
                        items(uiState.lists) { shoppingList ->
                            ListCard(
                                shoppingList = shoppingList,
                                onClick = { onNavigateToItems(shoppingList.id) }
                            )
                        }
                    }
                }
            }

            if (uiState.isLoading) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            }

            Button(
                onClick = viewModel::showCreateDialog,
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.Black),
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(top=524.dp, end = 25.dp)
                    .height(56.dp)
                    .width(200.dp)
            ) {
                Icon(
                    Icons.Default.Add,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(28.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    "Новый список",
                    color = Color.White,
                    style = MaterialTheme.typography.bodyMedium
                )
            }

        }
    }

    if (uiState.showCreateDialog) {
        CreateListDialog(
            listName = newListName,
            onNameChange = viewModel::updateNewListName,
            onConfirm = viewModel::createList,
            onDismiss = viewModel::hideCreateDialog
        )
    }

    uiState.errorMessage?.let { error ->
        LaunchedEffect(error) {
            Log.e("ListsScreen", error)
            viewModel.clearError()
        }
    }
}


@Composable
fun CustomTopBar(text: String) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(30.dp)
            .padding(top = 0.dp),
        contentAlignment = Alignment.BottomCenter
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.headlineMedium,
            color = Color.Black
        )
    }
}

