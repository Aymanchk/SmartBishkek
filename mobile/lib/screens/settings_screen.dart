import 'package:flutter/material.dart';
import '../services/api_service.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final _ctrl = TextEditingController();
  bool _loaded = false;

  @override
  void initState() {
    super.initState();
    ApiService.getBaseUrl().then((v) {
      _ctrl.text = v;
      setState(() => _loaded = true);
    });
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Настройки')),
      body: !_loaded
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  TextField(
                    controller: _ctrl,
                    decoration: const InputDecoration(
                      labelText: 'API base URL',
                      helperText: 'Android emulator: http://10.0.2.2:8000',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16),
                  FilledButton(
                    onPressed: () async {
                      await ApiService.setBaseUrl(_ctrl.text.trim());
                      if (!mounted) return;
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Сохранено')),
                      );
                      Navigator.pop(context);
                    },
                    child: const Text('Сохранить'),
                  ),
                ],
              ),
            ),
    );
  }
}
