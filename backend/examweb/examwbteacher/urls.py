from django.urls import path
from . import views

urlpatterns = [
    path("units/", views.units),
    path("categories/", views.categories),
    path("subtopics/", views.subtopics),
    path("papers/", views.papers),
    path("questions/", views.questions),
]
