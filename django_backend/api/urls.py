from django.urls import path
from .views import (
    HealthCheckView,
    MoodListCreateView,
    MoodDetailView,
    JournalListCreateView,
    JournalDetailView,
    SleepListCreateView,
    SleepDetailView,
    ActivityListCreateView,
    ActivityDetailView,
)

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),

    path('moods/', MoodListCreateView.as_view(), name='mood-list-create'),
    path('moods/<str:pk>/', MoodDetailView.as_view(), name='mood-detail'),

    path('journals/', JournalListCreateView.as_view(), name='journal-list-create'),
    path('journals/<str:pk>/', JournalDetailView.as_view(), name='journal-detail'),

    path('sleep/', SleepListCreateView.as_view(), name='sleep-list-create'),
    path('sleep/<str:pk>/', SleepDetailView.as_view(), name='sleep-detail'),

    path('activities/', ActivityListCreateView.as_view(), name='activity-list-create'),
    path('activities/<str:pk>/', ActivityDetailView.as_view(), name='activity-detail'),
]