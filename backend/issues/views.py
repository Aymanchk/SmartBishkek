from rest_framework import generics, status
from rest_framework.response import Response

from .ml import classify_image
from .models import Issue
from .serializers import IssueSerializer, IssueStatusUpdateSerializer


class IssueListCreateView(generics.ListCreateAPIView):
    serializer_class = IssueSerializer

    def get_queryset(self):
        qs = Issue.objects.all()
        if self.request.query_params.get("mine") == "1" and hasattr(self.request, "device") and self.request.device:
            qs = qs.filter(device=self.request.device)
        return qs

    def perform_create(self, serializer):
        device = getattr(self.request, "device", None)
        issue = serializer.save(device=device)
        try:
            category, confidence = classify_image(issue.image.path)
            issue.category = category
            issue.confidence = confidence
            issue.save(update_fields=["category", "confidence"])
        except Exception:
            issue.category = "other"
            issue.save(update_fields=["category"])


class IssueDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

    def get_serializer_class(self):
        if self.request.method in ("PATCH", "PUT"):
            return IssueStatusUpdateSerializer
        return IssueSerializer
