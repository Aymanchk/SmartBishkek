import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../services/location_service.dart';
import '../../theme/tokens.dart';
import 'report_locate_screen.dart';

class ReportPhotoScreen extends StatefulWidget {
  const ReportPhotoScreen({super.key});

  @override
  State<ReportPhotoScreen> createState() => _ReportPhotoScreenState();
}

class _ReportPhotoScreenState extends State<ReportPhotoScreen> {
  bool _busy = false;
  String? _error;

  Future<void> _capture(ImageSource src) async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final picked = await ImagePicker().pickImage(source: src, imageQuality: 80);
      if (picked == null) {
        setState(() => _busy = false);
        return;
      }
      final pos = await LocationService.getCurrentPosition();
      if (!mounted) return;
      Navigator.pushReplacement(context, MaterialPageRoute(
        builder: (_) => ReportLocateScreen(photo: File(picked.path), position: pos),
      ));
    } catch (e) {
      setState(() {
        _error = e.toString();
        _busy = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(children: [
          // header
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
            child: Row(children: [
              _circleBtn(Icons.close_rounded, () => Navigator.pop(context)),
              const Spacer(),
              const Text('1/3 · Фото',
                style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w600)),
              const Spacer(),
              const SizedBox(width: 40),
            ]),
          ),
          // viewfinder
          Expanded(child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              gradient: const LinearGradient(
                begin: Alignment.topCenter, end: Alignment.bottomCenter,
                colors: [Color(0xFF2A2A2A), Color(0xFF0E0E0E)],
              ),
            ),
            child: Stack(children: [
              Positioned.fill(
                child: Center(
                  child: Icon(Icons.image_outlined, size: 80, color: Colors.white.withValues(alpha: 0.15)),
                ),
              ),
              ..._brackets(),
              Positioned(
                top: 14, left: 14, right: 14,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.6),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: SBColors.amber500.withValues(alpha: 0.25)),
                  ),
                  child: const Row(children: [
                    Icon(Icons.auto_awesome_rounded, size: 16, color: SBColors.amber500),
                    SizedBox(width: 8),
                    Expanded(child: Text(
                      'Сделайте фото · ИИ определит категорию',
                      style: TextStyle(color: Colors.white, fontSize: 12.5, fontWeight: FontWeight.w600),
                    )),
                  ]),
                ),
              ),
              if (_error != null)
                Positioned(
                  bottom: 16, left: 16, right: 16,
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: SBColors.danger500.withValues(alpha: 0.9),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(_error!,
                      style: const TextStyle(color: Colors.white, fontSize: 12.5)),
                  ),
                ),
            ]),
          )),
          // shutter row
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _squareBtn(Icons.photo_library_outlined, () => _capture(ImageSource.gallery)),
                _shutter(),
                _squareBtn(Icons.bolt_rounded, _busy ? null : () {}),
              ],
            ),
          ),
        ]),
      ),
    );
  }

  Widget _circleBtn(IconData icon, VoidCallback onTap) => GestureDetector(
    onTap: onTap,
    child: Container(
      width: 40, height: 40,
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.15),
        shape: BoxShape.circle,
      ),
      child: Icon(icon, color: Colors.white, size: 20),
    ),
  );

  Widget _squareBtn(IconData icon, VoidCallback? onTap) => GestureDetector(
    onTap: onTap,
    child: Container(
      width: 50, height: 50,
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Icon(icon, color: Colors.white, size: 22),
    ),
  );

  Widget _shutter() => GestureDetector(
    onTap: _busy ? null : () => _capture(ImageSource.camera),
    child: Container(
      width: 78, height: 78,
      decoration: BoxDecoration(
        color: Colors.white,
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white.withValues(alpha: 0.3), width: 5),
      ),
      child: _busy
        ? const Padding(padding: EdgeInsets.all(20),
            child: CircularProgressIndicator(strokeWidth: 3, color: Colors.black))
        : null,
    ),
  );

  List<Widget> _brackets() {
    const len = 22.0, weight = 3.0;
    Widget bracket(Alignment a, {required bool top, required bool left}) => Align(
      alignment: a,
      child: Container(
        width: len, height: len,
        decoration: BoxDecoration(
          border: Border(
            top: top ? const BorderSide(color: SBColors.amber500, width: weight) : BorderSide.none,
            bottom: !top ? const BorderSide(color: SBColors.amber500, width: weight) : BorderSide.none,
            left: left ? const BorderSide(color: SBColors.amber500, width: weight) : BorderSide.none,
            right: !left ? const BorderSide(color: SBColors.amber500, width: weight) : BorderSide.none,
          ),
        ),
      ),
    );
    return [
      Padding(padding: const EdgeInsets.all(80),
        child: Stack(children: [
          bracket(Alignment.topLeft, top: true, left: true),
          bracket(Alignment.topRight, top: true, left: false),
          bracket(Alignment.bottomLeft, top: false, left: true),
          bracket(Alignment.bottomRight, top: false, left: false),
        ]),
      ),
    ];
  }
}
