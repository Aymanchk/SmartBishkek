from django.urls import path

from .views import IssueDetailView, IssueListCreateView

urlpatterns = [
    path("issues/", IssueListCreateView.as_view(), name="issue-list"),
    path("issues/<int:pk>/", IssueDetailView.as_view(), name="issue-detail"),
]
