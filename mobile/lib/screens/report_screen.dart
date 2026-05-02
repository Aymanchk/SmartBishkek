import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:geolocator/geolocator.dart';
import '../services/api_service.dart';
import '../services/location_service.dart';

class ReportScreen extends StatefulWidget {
  const ReportScreen({super.key});

  @override
  State<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  File? _photo;
  Position? _position;
  final _descCtrl = TextEditingController();
  bool _busy = false;
  String? _error;

  Future<void> _takePhoto() async {
    setState(() => _error = null);
    try {
      final picker = ImagePicker();
      final picked = await picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 80,
      );
      if (picked == null) return;
      final pos = await LocationService.getCurrentPosition();
      setState(() {
        _photo = File(picked.path);
        _position = pos;
      });
    } catch (e) {
      setState(() => _error = e.toString());
    }
  }

  Future<void> _submit() async {
    if (_photo == null || _position == null) return;
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await ApiService.createIssue(
        image: _photo!,
        latitude: _position!.latitude,
        longitude: _position!.longitude,
        description: _descCtrl.text.trim(),
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Заявка отправлена!')),
      );
      setState(() {
        _photo = null;
        _position = null;
        _descCtrl.clear();
      });
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  void dispose() {
    _descCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (_photo != null)
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.file(_photo!, height: 240, fit: BoxFit.cover),
            )
          else
            Container(
              height: 240,
              decoration: BoxDecoration(
                color: Colors.grey.shade200,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Center(
                child: Icon(Icons.image, size: 64, color: Colors.grey),
              ),
            ),
          const SizedBox(height: 12),
          if (_position != null)
            Text(
              'GPS: ${_position!.latitude.toStringAsFixed(5)}, ${_position!.longitude.toStringAsFixed(5)}',
              style: const TextStyle(fontFamily: 'monospace'),
            ),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: _busy ? null : _takePhoto,
            icon: const Icon(Icons.camera_alt),
            label: const Text('Сфотографировать проблему'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _descCtrl,
            maxLines: 3,
            decoration: const InputDecoration(
              labelText: 'Комментарий (необязательно)',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: (_photo == null || _position == null || _busy) ? null : _submit,
            child: _busy
                ? const SizedBox(
                    height: 20, width: 20,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                  )
                : const Text('Отправить заявку'),
          ),
          if (_error != null) ...[
            const SizedBox(height: 12),
            Text(_error!, style: const TextStyle(color: Colors.red)),
          ],
        ],
      ),
    );
  }
}
