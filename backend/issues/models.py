from django.db import models


class Device(models.Model):
    device_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.device_id


class Issue(models.Model):
    CATEGORY_CHOICES = [
        ("pothole", "Яма на дороге"),
        ("garbage", "Мусор/Свалка"),
        ("lighting", "Освещение"),
        ("other", "Другое"),
    ]

    STATUS_CHOICES = [
        ("pending", "Отправлено"),
        ("in_progress", "В работе"),
        ("resolved", "Решено"),
    ]

    device = models.ForeignKey(Device, on_delete=models.SET_NULL, null=True, blank=True, related_name="issues")
    image = models.ImageField(upload_to="issues/%Y/%m/%d/")
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    category = models.CharField(
        max_length=32, choices=CATEGORY_CHOICES, null=True, blank=True
    )
    confidence = models.FloatField(null=True, blank=True)
    description = models.TextField(blank=True, default="")
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Issue #{self.pk} [{self.category or 'unclassified'}] {self.status}"
