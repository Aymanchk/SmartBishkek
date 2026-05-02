class Issue {
  final int id;
  final String? imageUrl;
  final double latitude;
  final double longitude;
  final String? category;
  final double? confidence;
  final String description;
  final String status;
  final DateTime createdAt;

  Issue({
    required this.id,
    required this.imageUrl,
    required this.latitude,
    required this.longitude,
    required this.category,
    required this.confidence,
    required this.description,
    required this.status,
    required this.createdAt,
  });

  factory Issue.fromJson(Map<String, dynamic> json) => Issue(
        id: json['id'] as int,
        imageUrl: json['image_url'] as String?,
        latitude: double.parse(json['latitude'].toString()),
        longitude: double.parse(json['longitude'].toString()),
        category: json['category'] as String?,
        confidence: (json['confidence'] as num?)?.toDouble(),
        description: (json['description'] as String?) ?? '',
        status: json['status'] as String,
        createdAt: DateTime.parse(json['created_at'] as String),
      );

  static const Map<String, String> categoryLabels = {
    'pothole': 'Яма на дороге',
    'garbage': 'Мусор / Свалка',
    'lighting': 'Освещение',
    'other': 'Другое',
  };

  static const Map<String, String> statusLabels = {
    'pending': 'Отправлено',
    'in_progress': 'В работе',
    'resolved': 'Решено',
  };

  String get categoryLabel => categoryLabels[category] ?? '—';
  String get statusLabel => statusLabels[status] ?? status;
}
