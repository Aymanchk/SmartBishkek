import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';
import '../models/issue.dart';

class ApiService {
  // For Android emulator use 10.0.2.2; for iOS simulator use localhost.
  static const String defaultBaseUrl = 'http://10.0.2.2:8000';

  static Future<String> getBaseUrl() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('api_base_url') ?? defaultBaseUrl;
  }

  static Future<void> setBaseUrl(String url) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('api_base_url', url);
  }

  static Future<String> getDeviceId() async {
    final prefs = await SharedPreferences.getInstance();
    String? deviceId = prefs.getString('device_id');
    if (deviceId == null) {
      deviceId = const Uuid().v4();
      await prefs.setString('device_id', deviceId);
    }
    return deviceId;
  }

  static Future<Issue> createIssue({
    required File image,
    required double latitude,
    required double longitude,
    String description = '',
  }) async {
    final base = await getBaseUrl();
    final deviceId = await getDeviceId();
    final uri = Uri.parse('$base/api/issues/');
    
    final req = http.MultipartRequest('POST', uri)
      ..headers['X-Device-Id'] = deviceId
      ..fields['latitude'] = latitude.toString()
      ..fields['longitude'] = longitude.toString()
      ..fields['description'] = description
      ..files.add(await http.MultipartFile.fromPath('image', image.path));

    final streamed = await req.send();
    final body = await streamed.stream.bytesToString();
    if (streamed.statusCode >= 400) {
      throw Exception('API error ${streamed.statusCode}: $body');
    }
    return Issue.fromJson(json.decode(body) as Map<String, dynamic>);
  }

  static Future<List<Issue>> fetchAllIssues() async {
    final base = await getBaseUrl();
    final res = await http.get(Uri.parse('$base/api/issues/'));
    if (res.statusCode >= 400) {
      throw Exception('API error ${res.statusCode}');
    }
    return (json.decode(res.body) as List)
        .map((e) => Issue.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  static Future<List<Issue>> fetchMyIssues() async {
    final base = await getBaseUrl();
    final deviceId = await getDeviceId();
    
    final res = await http.get(
      Uri.parse('$base/api/issues/?mine=1'),
      headers: {'X-Device-Id': deviceId},
    );
    
    if (res.statusCode >= 400) {
      throw Exception('API error ${res.statusCode}');
    }
    final mine = (json.decode(res.body) as List)
        .map((e) => Issue.fromJson(e as Map<String, dynamic>))
        .toList();
    mine.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return mine;
  }
}
