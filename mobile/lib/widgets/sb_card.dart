import 'package:flutter/material.dart';
import '../theme/tokens.dart';

class SBCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final double radius;
  final VoidCallback? onTap;
  const SBCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(12),
    this.radius = SBRadius.lg,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    final box = Container(
      padding: padding,
      decoration: BoxDecoration(
        color: p.surface,
        border: Border.all(color: p.line),
        borderRadius: BorderRadius.circular(radius),
      ),
      child: child,
    );
    if (onTap == null) return box;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(radius),
      child: box,
    );
  }
}
