import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../theme/app_theme.dart';
import '../theme/tokens.dart';
import 'home_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _controller = PageController();
  int _index = 0;

  static final _slides = <_Slide>[
    _Slide(
      icon: Icons.camera_alt_rounded,
      tint: SBColors.amber500,
      title: 'Сообщите о проблеме',
      desc: 'Сфотографируйте — ИИ определит категорию автоматически',
    ),
    _Slide(
      icon: Icons.location_on_rounded,
      tint: SBColors.success500,
      title: 'Где это?',
      desc: 'GPS уточнит адрес, или поправьте на карте',
    ),
    _Slide(
      icon: Icons.timeline_rounded,
      tint: SBColors.info500,
      title: 'Следите за решением',
      desc: 'Уведомления на каждом этапе — от приёма до закрытия',
    ),
  ];

  Future<void> _finish() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('onboarded', true);
    if (!mounted) return;
    Navigator.pushReplacement(context, MaterialPageRoute(
      builder: (_) => const HomeScreen(),
    ));
  }

  void _next() {
    if (_index >= _slides.length - 1) {
      _finish();
    } else {
      _controller.nextPage(duration: const Duration(milliseconds: 280), curve: Curves.easeOut);
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    return Scaffold(
      backgroundColor: p.surface,
      body: SafeArea(
        child: Column(children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
            child: Row(children: [
              _LogoMark(text: p.text),
              const Spacer(),
              TextButton(
                onPressed: _finish,
                child: Text('Пропустить', style: context.bodySm.copyWith(
                  color: p.textSoft, fontWeight: FontWeight.w600)),
              ),
            ]),
          ),
          Expanded(child: PageView.builder(
            controller: _controller,
            onPageChanged: (i) => setState(() => _index = i),
            itemCount: _slides.length,
            itemBuilder: (_, i) => _SlideView(slide: _slides[i]),
          )),
          Padding(
            padding: const EdgeInsets.fromLTRB(28, 0, 28, 20),
            child: Row(children: [
              Row(children: List.generate(_slides.length, (i) {
                final active = i == _index;
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.only(right: 6),
                  width: active ? 22 : 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: active ? p.primary : p.line,
                    borderRadius: BorderRadius.circular(3),
                  ),
                );
              })),
              const Spacer(),
              FilledButton(
                onPressed: _next,
                style: FilledButton.styleFrom(
                  minimumSize: const Size(0, 48),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(SBRadius.pill)),
                ),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  Text(_index == _slides.length - 1 ? 'Начать' : 'Далее'),
                  const SizedBox(width: 8),
                  const Icon(Icons.arrow_forward_rounded, size: 18),
                ]),
              ),
            ]),
          ),
        ]),
      ),
    );
  }
}

class _Slide {
  final IconData icon;
  final Color tint;
  final String title, desc;
  _Slide({required this.icon, required this.tint, required this.title, required this.desc});
}

class _SlideView extends StatelessWidget {
  final _Slide slide;
  const _SlideView({required this.slide});

  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    return Padding(
      padding: const EdgeInsets.fromLTRB(28, 20, 28, 16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Expanded(child: Center(child: _Illustration(icon: slide.icon, tint: slide.tint))),
        Text(slide.title, style: context.h1.copyWith(color: p.text, fontSize: 28)),
        const SizedBox(height: 10),
        Text(slide.desc, style: context.bodyLg.copyWith(color: p.textSoft, height: 1.45)),
      ]),
    );
  }
}

class _Illustration extends StatelessWidget {
  final IconData icon;
  final Color tint;
  const _Illustration({required this.icon, required this.tint});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 240, height: 240,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(colors: [
          tint.withValues(alpha: 0.18),
          tint.withValues(alpha: 0.02),
        ]),
      ),
      child: Center(
        child: Container(
          width: 140, height: 140,
          decoration: BoxDecoration(
            color: tint.withValues(alpha: 0.18),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 72, color: tint),
        ),
      ),
    );
  }
}

class _LogoMark extends StatelessWidget {
  final Color text;
  const _LogoMark({required this.text});
  @override
  Widget build(BuildContext context) {
    return Row(children: [
      Container(
        width: 28, height: 28,
        decoration: BoxDecoration(
          color: SBColors.navy700,
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Center(child: Text('S',
          style: TextStyle(color: SBColors.amber500, fontSize: 16, fontWeight: FontWeight.w800))),
      ),
      const SizedBox(width: 8),
      Text('SmartBishkek', style: TextStyle(
        color: text, fontSize: 16, fontWeight: FontWeight.w800, letterSpacing: -0.3)),
    ]);
  }
}
