import 'package:flutter/material.dart';
import '../theme/tokens.dart';
import '../theme/app_theme.dart';
import 'feed_screen.dart';
import 'history_screen.dart';
import 'profile_screen.dart';
import 'map_screen.dart';
import 'report/report_photo_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _index = 0;

  static const _screens = [
    FeedScreen(),
    MapScreen(),
    HistoryScreen(),
    ProfileScreen(),
  ];

  void _openReport() {
    Navigator.of(context).push(MaterialPageRoute(
      builder: (_) => const ReportPhotoScreen(),
      fullscreenDialog: true,
    ));
  }

  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    return Scaffold(
      backgroundColor: p.bg,
      body: IndexedStack(index: _index, children: _screens),
      bottomNavigationBar: _SBTabBar(
        active: _index,
        onTap: (i) => setState(() => _index = i),
        onCenterTap: _openReport,
      ),
    );
  }
}

class _SBTabBar extends StatelessWidget {
  final int active;
  final ValueChanged<int> onTap;
  final VoidCallback onCenterTap;
  const _SBTabBar({required this.active, required this.onTap, required this.onCenterTap});

  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    final items = [
      (Icons.home_rounded, 'Главная'),
      (Icons.map_rounded, 'Карта'),
      (Icons.list_alt_rounded, 'Мои'),
      (Icons.person_rounded, 'Профиль'),
    ];
    return Container(
      decoration: BoxDecoration(
        color: p.surface,
        border: Border(top: BorderSide(color: p.line)),
      ),
      padding: EdgeInsets.fromLTRB(0, 8, 0, MediaQuery.of(context).padding.bottom > 0 ? 0 : 8),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 60,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              _tabItem(context, 0, items[0].$1, items[0].$2),
              _tabItem(context, 1, items[1].$1, items[1].$2),
              _centerFab(context),
              _tabItem(context, 2, items[2].$1, items[2].$2),
              _tabItem(context, 3, items[3].$1, items[3].$2),
            ],
          ),
        ),
      ),
    );
  }

  Widget _tabItem(BuildContext context, int i, IconData icon, String label) {
    final p = SBPalette.of(context);
    final isActive = active == i;
    final color = isActive ? p.primary : p.textMuted;
    return InkWell(
      onTap: () => onTap(i),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        constraints: const BoxConstraints(minWidth: 56),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 22, color: color),
            const SizedBox(height: 3),
            Text(label, style: TextStyle(
              fontSize: 10.5, color: color,
              fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
            )),
          ],
        ),
      ),
    );
  }

  Widget _centerFab(BuildContext context) {
    final p = SBPalette.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: GestureDetector(
        onTap: onCenterTap,
        child: Container(
          width: 56, height: 56,
          decoration: BoxDecoration(
            color: p.primary,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: (p.dark ? SBColors.amber500 : SBColors.navy700).withValues(alpha: 0.4),
                blurRadius: 20, offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Icon(Icons.add_rounded, size: 30, color: p.primaryFg),
        ),
      ),
    );
  }
}

class _MapPlaceholder extends StatelessWidget {
  const _MapPlaceholder();
  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    return SafeArea(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.map_outlined, size: 64, color: p.textMuted),
            const SizedBox(height: 12),
            Text('Карта', style: context.h2.copyWith(color: p.text)),
            const SizedBox(height: 4),
            Text('Скоро здесь появятся заявки рядом',
                style: context.body.copyWith(color: p.textMuted)),
          ],
        ),
      ),
    );
  }
}
