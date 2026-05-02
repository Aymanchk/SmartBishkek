import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'tokens.dart';

class AppTheme {
  static ThemeData light() => _build(SBPalette.light(), Brightness.light);
  static ThemeData dark()  => _build(SBPalette.dark(),  Brightness.dark);

  static ThemeData _build(SBPalette p, Brightness b) {
    final base = ThemeData(brightness: b);
    final textTheme = GoogleFonts.manropeTextTheme(base.textTheme).apply(
      bodyColor: p.text,
      displayColor: p.text,
    );
    return base.copyWith(
      scaffoldBackgroundColor: p.bg,
      colorScheme: (b == Brightness.dark ? const ColorScheme.dark() : const ColorScheme.light()).copyWith(
        primary: p.primary,
        onPrimary: p.primaryFg,
        surface: p.surface,
        onSurface: p.text,
      ),
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        backgroundColor: p.bg, surfaceTintColor: Colors.transparent,
        elevation: 0, foregroundColor: p.text,
        titleTextStyle: GoogleFonts.manrope(
          fontSize: 18, fontWeight: FontWeight.w800, color: p.text, letterSpacing: -0.3,
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: p.primary, foregroundColor: p.primaryFg,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          textStyle: GoogleFonts.manrope(fontSize: 15, fontWeight: FontWeight.w700),
          minimumSize: const Size.fromHeight(52),
        ),
      ),
      dividerColor: p.line,
    );
  }
}

extension SBTextStyles on BuildContext {
  TextStyle get displayLg => GoogleFonts.manrope(fontSize: 32, fontWeight: FontWeight.w800, letterSpacing: -0.5, height: 1.1);
  TextStyle get h1        => GoogleFonts.manrope(fontSize: 26, fontWeight: FontWeight.w800, letterSpacing: -0.4, height: 1.15);
  TextStyle get h2        => GoogleFonts.manrope(fontSize: 22, fontWeight: FontWeight.w800, letterSpacing: -0.3);
  TextStyle get h3        => GoogleFonts.manrope(fontSize: 18, fontWeight: FontWeight.w700);
  TextStyle get h4        => GoogleFonts.manrope(fontSize: 16, fontWeight: FontWeight.w700);
  TextStyle get bodyLg    => GoogleFonts.manrope(fontSize: 15, fontWeight: FontWeight.w400, height: 1.45);
  TextStyle get body      => GoogleFonts.manrope(fontSize: 14, fontWeight: FontWeight.w400, height: 1.45);
  TextStyle get bodySm    => GoogleFonts.manrope(fontSize: 13, fontWeight: FontWeight.w400);
  TextStyle get caption   => GoogleFonts.manrope(fontSize: 12, fontWeight: FontWeight.w500);
  TextStyle get micro     => GoogleFonts.manrope(fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.04 * 11);
  TextStyle get mono      => GoogleFonts.jetBrainsMono(fontSize: 12, fontWeight: FontWeight.w500);
}
