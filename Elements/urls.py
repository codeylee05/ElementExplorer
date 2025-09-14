from django.urls import path
from . import views
from django.views.generic import TemplateView

urlpatterns = [
    path("", views.index, name="index"),
    # path("periodic_table/", views.periodic_table, name="periodic_table"),
    path('data/elements.json', TemplateView.as_view(
        template_name='/static/data/elements.json', content_type='application/json')),

]
