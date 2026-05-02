from rest_framework import serializers

from .models import Issue


class IssueSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Issue
        fields = [
            "id",
            "image",
            "image_url",
            "latitude",
            "longitude",
            "category",
            "confidence",
            "description",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "category", "confidence", "created_at", "updated_at", "image_url"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if not obj.image:
            return None
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url


class IssueStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ["status"]
