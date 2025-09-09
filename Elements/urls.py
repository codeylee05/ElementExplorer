from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),  # GET ?q=O or ?q=oxygen etc.
]
