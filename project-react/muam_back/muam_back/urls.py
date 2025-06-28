from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('shop.urls')),
    path('api/user/', include('users.urls')),
    path('healthcheck/', lambda r: HttpResponse())
]
