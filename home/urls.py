from django.contrib import admin
from django.urls import path
from home import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("",views.loginPage,name='login'),
    path("signup/",views.signupPage,name='signup'),
]