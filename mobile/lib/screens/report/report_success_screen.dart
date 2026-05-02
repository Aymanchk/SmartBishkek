import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../theme/tokens.dart';
import '../../widgets/sb_card.dart';

class ReportSuccessScreen extends StatelessWidget {
  final int issueId;
  final String category;
  const ReportSuccessScreen({super.key, required this.issueId, required this.category});

  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    final cat = SBCategory.get(category);
    return Scaffold(
      backgroundColor: p.bg,
      body: SafeArea(
        child: Column(children: [
          Expanded(child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _CheckCircle(p: p),
                const SizedBox(height: 28),
                Text('Заявка отправлена',
                  style: context.h1.copyWith(color: p.text), textAlign: TextAlign.center),
                const SizedBox(height: 6),
                RichText(
                  textAlign: TextAlign.center,
                  text: TextSpan(
                    style: context.body.copyWith(color: p.textSoft),
                    children: [
                      const TextSpan(text: 'Номер '),
                      TextSpan(text: '№$issueId',
                        style: context.mono.copyWith(fontWeight: FontWeight.w700, color: p.text, fontSize: 14)),
                      const TextSpan(text: '\nОбычно решается за 5–7 дней'),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                // category determined
                SBCard(
                  padding: const EdgeInsets.all(14),
                  radius: 14,
                  child: Row(children: [
                    Container(
                      width: 40, height: 40,
                      decoration: BoxDecoration(
                        color: cat.hue.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(cat.icon, color: cat.hue, size: 22),
                    ),
                    const SizedBox(width: 12),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text('ИИ определил', style: context.caption.copyWith(color: p.textMuted)),
                      Text(cat.ru, style: context.h4.copyWith(color: p.text)),
                    ])),
                  ]),
                ),
                const SizedBox(height: 16),
                // mini timeline
                SBCard(
                  padding: const EdgeInsets.all(14),
                  radius: 14,
                  child: Column(children: [
                    Row(children: [
                      Container(width: 10, height: 10,
                        decoration: const BoxDecoration(color: SBColors.amber500, shape: BoxShape.circle)),
                      const SizedBox(width: 10),
                      Text('Новая', style: context.body.copyWith(fontWeight: FontWeight.w700, color: p.text)),
                      const Spacer(),
                      Text('сейчас', style: context.caption.copyWith(color: p.textMuted)),
                    ]),
                    Container(
                      margin: const EdgeInsets.only(left: 4),
                      height: 24, width: 2,
                      decoration: BoxDecoration(color: p.line),
                    ),
                    Opacity(opacity: 0.5, child: Row(children: [
                      Container(width: 10, height: 10,
                        decoration: BoxDecoration(color: p.line, shape: BoxShape.circle,
                          border: Border.all(color: p.line, width: 2))),
                      const SizedBox(width: 10),
                      Text('Принята', style: context.body.copyWith(fontWeight: FontWeight.w600, color: p.text)),
                      const Spacer(),
                      Text('в течение 24 ч', style: context.caption.copyWith(color: p.textMuted)),
                    ])),
                  ]),
                ),
              ],
            ),
          )),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Column(children: [
              FilledButton(
                onPressed: () => Navigator.popUntil(context, (r) => r.isFirst),
                child: const Text('Отслеживать статус'),
              ),
              TextButton(
                onPressed: () => Navigator.popUntil(context, (r) => r.isFirst),
                child: Text('На главную',
                  style: context.body.copyWith(color: p.text, fontWeight: FontWeight.w600)),
              ),
            ]),
          ),
        ]),
      ),
    );
  }
}

class _CheckCircle extends StatelessWidget {
  final SBPalette p;
  const _CheckCircle({required this.p});
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 120, height: 120,
      child: Stack(alignment: Alignment.center, children: [
        Container(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: p.dark
              ? SBColors.success500.withValues(alpha: 0.15)
              : SBColors.success100,
          ),
        ),
        Container(
          width: 80, height: 80,
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
            color: SBColors.success500,
          ),
          child: const Icon(Icons.check_rounded, color: Colors.white, size: 44),
        ),
      ]),
    );
  }
}
