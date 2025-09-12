from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    # path("periodic_table/", views.periodic_table, name="periodic_table"),
]
