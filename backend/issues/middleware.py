from .models import Device

class DeviceMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        device_id = request.headers.get("X-Device-Id")
        if device_id:
            device, _ = Device.objects.get_or_create(device_id=device_id)
            request.device = device
        else:
            request.device = None

        response = self.get_response(request)
        return response
