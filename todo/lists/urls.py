from django.urls import path
from .views import *

urlpatterns = [
    path('', todo_list_display),
    path('items/', todo_list),
    path('items/<int:pk>/', todo_detail),
]
