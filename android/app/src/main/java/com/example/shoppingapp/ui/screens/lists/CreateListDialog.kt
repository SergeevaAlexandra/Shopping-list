package com.example.shoppingapp.ui.screens.lists

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.material3.OutlinedTextField
import com.example.shoppingapp.ui.screens.profile.myTextFieldColors

@Composable
fun CreateListDialog(
    listName: String,
    onNameChange: (String) -> Unit,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Новый список") },
        text = {
            Column {
                OutlinedTextField(
                    value = listName,
                    onValueChange = onNameChange,
                    label = { Text("Название списка") },
                    colors = myTextFieldColors(),
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(16.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    val buttonColors = ButtonDefaults.buttonColors(
                        containerColor = Color.Black,
                        contentColor = Color.White,
                        disabledContainerColor = Color.Black,
                        disabledContentColor = Color.White
                    )

                    Button(
                        onClick = onDismiss,
                        shape = RoundedCornerShape(10.dp),
                        colors = buttonColors,
                        modifier = Modifier
                            .height(40.dp)
                            .width(100.dp)
                    ) {
                        Text("Отмена", style = MaterialTheme.typography.bodySmall)
                    }

                    Button(
                        onClick = onConfirm,
                        enabled = listName.isNotBlank(),
                        shape = RoundedCornerShape(10.dp),
                        colors = buttonColors,
                        modifier = Modifier
                            .height(40.dp)
                            .width(100.dp)
                    ) {
                        Text("Создать", style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        },
        confirmButton = {},
        dismissButton = {},
        containerColor = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(8.dp)
    )
}

