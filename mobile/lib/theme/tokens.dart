import 'package:flutter/material.dart';

/// SmartBishkek design tokens — mirrors `design/tokens.jsx`.
class SBColors {
  // Brand
  static const navy900 = Color(0xFF0F1F33);
  static const navy800 = Color(0xFF162C45);
  static const navy700 = Color(0xFF1F3B5B); // PRIMARY
  static const navy600 = Color(0xFF2C4F75);
  static const navy500 = Color(0xFF3D6491);
  static const navy400 = Color(0xFF6B8AB0);
  static const navy300 = Color(0xFF9DB3CE);
  static const navy200 = Color(0xFFCDD9E6);
  static const navy100 = Color(0xFFE6ECF3);
  static const navy50  = Color(0xFFF4F7FA);

  // Accent
  static const amber900 = Color(0xFF7A4D08);
  static const amber700 = Color(0xFFB8740F);
  static const amber500 = Color(0xFFF39C12); // ACCENT
  static const amber400 = Color(0xFFF6B147);
  static const amber300 = Color(0xFFFACE85);
  static const amber200 = Color(0xFFFCE3B7);
  static const amber100 = Color(0xFFFEF2DD);
  static const amber50  = Color(0xFFFFF8EC);

  // Status
  static const success700 = Color(0xFF1F7A4A);
  static const success500 = Color(0xFF2EA86A);
  static const success100 = Color(0xFFDDF1E5);
  static const danger700  = Color(0xFFA82626);
  static const danger500  = Color(0xFFD63838);
  static const danger100  = Color(0xFFFBE0E0);
  static const info700    = Color(0xFF1968B5);
  static const info500    = Color(0xFF2E8AE0);
  static const info100    = Color(0xFFDEEDFA);
  static const purple700  = Color(0xFF5A2D8C);
  static const purple500  = Color(0xFF7A40B8);
  static const purple100  = Color(0xFFEFE5F8);

  // Light surface
  static const ink        = Color(0xFF161A21);
  static const text       = Color(0xFF3A4150);
  static const textSoft   = Color(0xFF5A6273);
  static const textMuted  = Color(0xFF8A93A4);
  static const line       = Color(0xFFE4E6EB);
  static const lineSoft   = Color(0xFFEEF0F4);
  static const surface    = Color(0xFFFFFFFF);
  static const surfaceAlt = Color(0xFFF8F8F5);
  static const canvas     = Color(0xFFF2F1EC);

  // Dark surface
  static const dInk        = Color(0xFFF4F4F0);
  static const dText       = Color(0xFFD8D9D2);
  static const dTextSoft   = Color(0xFF9CA1A8);
  static const dTextMuted  = Color(0xFF6E7480);
  static const dLine       = Color(0xFF262A33);
  static const dLineSoft   = Color(0xFF1B1E26);
  static const dSurface    = Color(0xFF0F1217);
  static const dSurfaceAlt = Color(0xFF161A22);
  static const dCanvas     = Color(0xFF0A0C10);
}

/// Theme-resolved color palette.
class SBPalette {
  final Color bg, surface, surfaceAlt;
  final Color text, textSoft, textMuted;
  final Color line, lineSoft;
  final Color primary, primaryFg;
  final bool dark;

  const SBPalette({
    required this.bg, required this.surface, required this.surfaceAlt,
    required this.text, required this.textSoft, required this.textMuted,
    required this.line, required this.lineSoft,
    required this.primary, required this.primaryFg,
    required this.dark,
  });

  factory SBPalette.light() => const SBPalette(
    bg: SBColors.surfaceAlt, surface: SBColors.surface, surfaceAlt: SBColors.surfaceAlt,
    text: SBColors.ink, textSoft: SBColors.text, textMuted: SBColors.textMuted,
    line: SBColors.line, lineSoft: SBColors.lineSoft,
    primary: SBColors.navy700, primaryFg: Colors.white,
    dark: false,
  );

  factory SBPalette.dark() => const SBPalette(
    bg: SBColors.dCanvas, surface: SBColors.dSurface, surfaceAlt: SBColors.dSurfaceAlt,
    text: SBColors.dInk, textSoft: SBColors.dText, textMuted: SBColors.dTextMuted,
    line: SBColors.dLine, lineSoft: SBColors.dLineSoft,
    primary: SBColors.amber500, primaryFg: Color(0xFF1A1207),
    dark: true,
  );

  static SBPalette of(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark ? SBPalette.dark() : SBPalette.light();
}

class SBStatus {
  final Color bg, fg, dot;
  final String labelRu, labelKg;
  const SBStatus(this.bg, this.fg, this.dot, this.labelRu, this.labelKg);

  static const map = {
    'pending':    SBStatus(SBColors.amber100,   SBColors.amber700,  SBColors.amber500,  'Новая',     'Жаңы'),
    'accepted':   SBStatus(SBColors.info100,    SBColors.info700,   SBColors.info500,   'Принята',   'Кабыл алынды'),
    'in_progress':SBStatus(SBColors.purple100,  SBColors.purple700, SBColors.purple500, 'В работе',  'Иштелүүдө'),
    'resolved':   SBStatus(SBColors.success100, SBColors.success700,SBColors.success500,'Решена',    'Чечилди'),
    'rejected':   SBStatus(SBColors.danger100,  SBColors.danger700, SBColors.danger500, 'Отклонена', 'Четке кагылды'),
  };

  static SBStatus get(String? key) => map[key] ?? map['pending']!;
}

class SBCategory {
  final String ru, kg;
  final Color hue;
  final IconData icon;
  const SBCategory(this.ru, this.kg, this.hue, this.icon);

  static const map = {
    'pothole':  SBCategory('Яма на дороге', 'Жолдогу чуңкур', SBColors.danger500,  Icons.warning_amber_rounded),
    'garbage':  SBCategory('Мусор',         'Таштанды',        SBColors.success500, Icons.delete_outline_rounded),
    'lighting': SBCategory('Освещение',     'Жарык',           SBColors.amber500,   Icons.lightbulb_outline_rounded),
    'other':    SBCategory('Другое',        'Башка',           SBColors.textSoft,   Icons.help_outline_rounded),
  };

  static SBCategory get(String? key) => map[key] ?? map['other']!;
}

class SBRadius {
  static const xs = 4.0, sm = 6.0, md = 10.0, lg = 14.0, xl = 20.0, pill = 999.0;
}

class SBShadow {
  static const xs = [BoxShadow(color: Color(0x0F0F1F33), blurRadius: 2, offset: Offset(0, 1))];
  static const sm = [BoxShadow(color: Color(0x140F1F33), blurRadius: 3, offset: Offset(0, 1))];
  static const md = [BoxShadow(color: Color(0x1A0F1F33), blurRadius: 12, offset: Offset(0, 4))];
  static const lg = [BoxShadow(color: Color(0x240F1F33), blurRadius: 32, offset: Offset(0, 12))];
}
