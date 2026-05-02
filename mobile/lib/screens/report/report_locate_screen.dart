import 'dart:io';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../../services/api_service.dart';
import '../../theme/app_theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/sb_card.dart';
import 'report_success_screen.dart';

class ReportLocateScreen extends StatefulWidget {
  final File photo;
  final Position position;
  const ReportLocateScreen({super.key, required this.photo, required this.position});

  @override
  State<ReportLocateScreen> createState() => _ReportLocateScreenState();
}

class _ReportLocateScreenState extends State<ReportLocateScreen> {
  final _descCtrl = TextEditingController();
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _descCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final issue = await ApiService.createIssue(
        image: widget.photo,
        latitude: widget.position.latitude,
        longitude: widget.position.longitude,
        description: _descCtrl.text.trim(),
      );
      if (!mounted) return;
      Navigator.pushReplacement(context, MaterialPageRoute(
        builder: (_) => ReportSuccessScreen(issueId: issue.id, category: issue.category ?? 'other'),
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
    final p = SBPalette.of(context);
    return Scaffold(
      backgroundColor: p.bg,
      body: SafeArea(
        child: Column(children: [
          // header with progress
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 6, 16, 12),
            child: Row(children: [
              Container(
                width: 40, height: 40,
                decoration: BoxDecoration(
                  color: p.surface, shape: BoxShape.circle,
                  border: Border.all(color: p.line),
                ),
                child: IconButton(
                  iconSize: 20, padding: EdgeInsets.zero,
                  icon: Icon(Icons.arrow_back_rounded, color: p.text),
                  onPressed: () => Navigator.pop(context),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(child: Row(children: List.generate(3, (i) => Expanded(child: Container(
                margin: EdgeInsets.only(right: i < 2 ? 4 : 0),
                height: 4,
                decoration: BoxDecoration(
                  color: i < 2 ? p.primary : p.line,
                  borderRadius: BorderRadius.circular(2),
                ),
              ))))),
              const SizedBox(width: 10),
              Text('2/3', style: context.caption.copyWith(color: p.textSoft, fontWeight: FontWeight.w600)),
            ]),
          ),
          Expanded(child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            children: [
              // photo strip
              Row(children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.file(widget.photo, width: 76, height: 76, fit: BoxFit.cover),
                ),
                const SizedBox(width: 8),
                Container(
                  width: 76, height: 76,
                  decoration: BoxDecoration(
                    color: p.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: p.line, style: BorderStyle.solid, width: 1.5),
                  ),
                  child: Icon(Icons.add_rounded, size: 28, color: p.textMuted),
                ),
              ]),
              const SizedBox(height: 16),

              // AI detected
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: p.dark
                    ? SBColors.amber500.withValues(alpha: 0.10)
                    : SBColors.amber50,
                  border: Border.all(color: SBColors.amber300),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    const Icon(Icons.auto_awesome_rounded, size: 14, color: SBColors.amber700),
                    const SizedBox(width: 6),
                    Text('ИИ ОПРЕДЕЛИТ КАТЕГОРИЮ',
                      style: context.micro.copyWith(color: SBColors.amber700)),
                  ]),
                  const SizedBox(height: 10),
                  Row(children: [
                    Container(
                      width: 48, height: 48,
                      decoration: BoxDecoration(
                        color: SBColors.amber500.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.auto_awesome_motion_rounded, color: SBColors.amber700),
                    ),
                    const SizedBox(width: 12),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text('Анализируем фото…',
                        style: context.h4.copyWith(color: p.text)),
                      const SizedBox(height: 2),
                      Text('Категория появится после отправки',
                        style: context.caption.copyWith(color: p.textSoft)),
                    ])),
                  ]),
                ]),
              ),
              const SizedBox(height: 14),

              // address
              Text('Адрес', style: context.bodySm.copyWith(fontWeight: FontWeight.w600, color: p.text)),
              const SizedBox(height: 6),
              SBCard(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                radius: 12,
                child: Row(children: [
                  const Icon(Icons.location_on_rounded, color: SBColors.success500, size: 20),
                  const SizedBox(width: 10),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('${widget.position.latitude.toStringAsFixed(5)}, ${widget.position.longitude.toStringAsFixed(5)}',
                      style: context.body.copyWith(fontWeight: FontWeight.w600)),
                    Text('Уточнено GPS',
                      style: context.caption.copyWith(color: p.textMuted, fontSize: 11.5)),
                  ])),
                  const Icon(Icons.check_rounded, color: SBColors.success500, size: 20),
                ]),
              ),
              const SizedBox(height: 14),

              // description
              Row(children: [
                Text('Описание', style: context.bodySm.copyWith(fontWeight: FontWeight.w600, color: p.text)),
                const Spacer(),
                Text('необязательно', style: context.caption.copyWith(color: p.textMuted)),
              ]),
              const SizedBox(height: 6),
              Container(
                decoration: BoxDecoration(
                  color: p.surface,
                  border: Border.all(color: p.line),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: TextField(
                  controller: _descCtrl,
                  maxLines: 3,
                  style: context.body.copyWith(color: p.text),
                  decoration: InputDecoration(
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    hintText: 'Что именно произошло?',
                    hintStyle: context.body.copyWith(color: p.textMuted),
                  ),
                ),
              ),

              if (_error != null) ...[
                const SizedBox(height: 12),
                Text(_error!, style: TextStyle(color: SBColors.danger500)),
              ],
            ],
          )),
          // footer button
          Container(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
            decoration: BoxDecoration(
              color: p.surface,
              border: Border(top: BorderSide(color: p.line)),
            ),
            child: FilledButton(
              onPressed: _busy ? null : _submit,
              child: _busy
                ? const SizedBox(width: 22, height: 22,
                    child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white))
                : Row(mainAxisAlignment: MainAxisAlignment.center, children: const [
                    Text('Отправить заявку'),
                    SizedBox(width: 8),
                    Icon(Icons.arrow_forward_rounded, size: 18),
                  ]),
            ),
          ),
        ]),
      ),
    );
  }
}
