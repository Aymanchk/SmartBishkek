import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../theme/tokens.dart';
import 'settings_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    return SafeArea(
      bottom: false,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(4, 0, 0, 16),
            child: Text('Настройки', style: context.h1.copyWith(color: p.text)),
          ),
          // identity
          _identity(context, p),
          const SizedBox(height: 14),
          // stats
          _statsRow(context, p),
          const SizedBox(height: 14),
          _Group(title: 'Настройки', children: [
            _Row(icon: Icons.language_rounded, iconBg: SBColors.info500, title: 'Язык', value: 'Русский'),
            _Row(icon: Icons.dark_mode_rounded, iconBg: SBColors.navy700, title: 'Тема', value: p.dark ? 'Тёмная' : 'Светлая'),
            _Row(icon: Icons.notifications_rounded, iconBg: SBColors.amber500, title: 'Уведомления', toggle: true),
          ]),
          _Group(title: 'Поддержка', children: [
            _Row(icon: Icons.help_outline_rounded, iconBg: SBColors.success500, title: 'Помощь'),
            _Row(icon: Icons.shield_outlined, iconBg: SBColors.textSoft, title: 'Конфиденциальность'),
            _Row(
              icon: Icons.settings_rounded, iconBg: SBColors.purple500,
              title: 'API URL',
              onTap: () => Navigator.push(context, MaterialPageRoute(
                builder: (_) => const SettingsScreen(),
              )),
              last: true,
            ),
          ]),
          const SizedBox(height: 14),
          OutlinedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.logout_rounded, size: 18),
            label: const Text('Выйти'),
            style: OutlinedButton.styleFrom(
              foregroundColor: SBColors.danger500,
              side: BorderSide(color: p.line),
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              textStyle: context.body.copyWith(fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  Widget _identity(BuildContext context, SBPalette p) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: p.surface,
        border: Border.all(color: p.line),
        borderRadius: BorderRadius.circular(SBRadius.lg),
      ),
      child: Row(children: [
        Container(
          width: 56, height: 56,
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
            gradient: LinearGradient(
              begin: Alignment.topLeft, end: Alignment.bottomRight,
              colors: [SBColors.navy500, SBColors.navy800],
            ),
          ),
          child: const Center(child: Text('А', style: TextStyle(
            color: Colors.white, fontSize: 22, fontWeight: FontWeight.w800))),
        ),
        const SizedBox(width: 14),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Айбек Жумагулов', style: context.h4.copyWith(color: p.text)),
          const SizedBox(height: 2),
          Text('+996 555 12-34-56', style: context.caption.copyWith(color: p.textMuted)),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: SBColors.success100,
              borderRadius: BorderRadius.circular(SBRadius.pill),
            ),
            child: const Row(mainAxisSize: MainAxisSize.min, children: [
              Icon(Icons.verified_rounded, size: 11, color: SBColors.success700),
              SizedBox(width: 3),
              Text('Подтверждён', style: TextStyle(
                fontSize: 11, color: SBColors.success700, fontWeight: FontWeight.w700)),
            ]),
          ),
        ])),
        Icon(Icons.chevron_right_rounded, color: p.textMuted),
      ]),
    );
  }

  Widget _statsRow(BuildContext context, SBPalette p) {
    Widget cell(String n, String l) => Expanded(child: Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: p.surface,
        border: Border.all(color: p.line),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(children: [
        Text(n, style: context.h2.copyWith(color: p.text, fontSize: 22)),
        const SizedBox(height: 1),
        Text(l, style: context.caption.copyWith(color: p.textMuted, fontSize: 11.5)),
      ]),
    ));
    return Row(children: [
      cell('12', 'Заявок'),
      const SizedBox(width: 8),
      cell('8', 'Решено'),
      const SizedBox(width: 8),
      cell('47', 'Голосов'),
    ]);
  }
}

class _Group extends StatelessWidget {
  final String title;
  final List<Widget> children;
  const _Group({required this.title, required this.children});
  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(8, 0, 0, 6),
          child: Text(title.toUpperCase(),
            style: context.micro.copyWith(color: p.textMuted)),
        ),
        Container(
          decoration: BoxDecoration(
            color: p.surface,
            border: Border.all(color: p.line),
            borderRadius: BorderRadius.circular(SBRadius.lg),
          ),
          child: Column(children: children),
        ),
      ]),
    );
  }
}

class _Row extends StatelessWidget {
  final IconData icon;
  final Color iconBg;
  final String title;
  final String? value;
  final bool toggle, last;
  final VoidCallback? onTap;
  const _Row({
    required this.icon, required this.iconBg, required this.title,
    this.value, this.toggle = false, this.last = false, this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          border: last ? null : Border(bottom: BorderSide(color: p.line)),
        ),
        child: Row(children: [
          Container(
            width: 30, height: 30,
            decoration: BoxDecoration(
              color: iconBg,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: Colors.white, size: 16),
          ),
          const SizedBox(width: 12),
          Expanded(child: Text(title,
            style: context.body.copyWith(fontWeight: FontWeight.w600, color: p.text))),
          if (value != null)
            Padding(
              padding: const EdgeInsets.only(right: 6),
              child: Text(value!, style: context.bodySm.copyWith(color: p.textMuted)),
            ),
          if (toggle)
            const _ToggleOn()
          else
            Icon(Icons.chevron_right_rounded, color: p.textMuted, size: 18),
        ]),
      ),
    );
  }
}

class _ToggleOn extends StatelessWidget {
  const _ToggleOn();
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 36, height: 22,
      decoration: BoxDecoration(
        color: SBColors.navy700,
        borderRadius: BorderRadius.circular(SBRadius.pill),
      ),
      child: const Align(
        alignment: Alignment.centerRight,
        child: Padding(
          padding: EdgeInsets.only(right: 2),
          child: CircleAvatar(radius: 9, backgroundColor: Colors.white),
        ),
      ),
    );
  }
}
