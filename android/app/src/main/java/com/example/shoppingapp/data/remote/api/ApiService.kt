package com.example.shoppingapp.data.remote.api

import com.example.shoppingapp.data.remote.dto.CommandRequest
import com.example.shoppingapp.data.remote.dto.CommandResponse
import java.util.concurrent.TimeUnit
import retrofit2.http.POST
import retrofit2.http.Body
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor

interface ApiService {

    @POST("execute")
    suspend fun executeCommand(@Body request: CommandRequest): retrofit2.Response<CommandResponse>

    companion object {
        private const val BASE_URL = "http://10.0.2.2:8000/"

        fun create(): ApiService {
            val loggingInterceptor = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            }

            val client = OkHttpClient.Builder()
                .addInterceptor(loggingInterceptor)
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .build()

            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(ApiService::class.java)
        }
    }
}