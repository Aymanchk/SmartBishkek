import 'package:flutter/material.dart';
import '../theme/tokens.dart';
import '../theme/app_theme.dart';

class StatusBadge extends StatelessWidget {
  final String status;
  const StatusBadge(this.status, {super.key});

  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    final s = SBStatus.get(status);
    final bg = p.dark ? s.dot.withValues(alpha: 0.22) : s.bg;
    final fg = p.dark ? s.dot : s.fg;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(SBRadius.pill)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(width: 6, height: 6, decoration: BoxDecoration(color: s.dot, shape: BoxShape.circle)),
          const SizedBox(width: 5),
          Text(s.labelRu, style: context.micro.copyWith(color: fg, fontSize: 10.5)),
        ],
      ),
    );
  }
}

class CategoryTile extends StatelessWidget {
  final String category;
  final double size;
  const CategoryTile(this.category, {super.key, this.size = 44});

  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    final c = SBCategory.get(category);
    return Container(
      width: size, height: size,
      decoration: BoxDecoration(
        color: c.hue.withValues(alpha: p.dark ? 0.20 : 0.14),
        borderRadius: BorderRadius.circular(SBRadius.md),
      ),
      child: Icon(c.icon, color: c.hue, size: size * 0.5),
    );
  }
}
