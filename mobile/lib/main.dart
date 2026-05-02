import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/home_screen.dart';
import 'screens/onboarding_screen.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  final seen = prefs.getBool('onboarded') ?? false;
  runApp(SmartBishkekApp(showOnboarding: !seen));
}

class SmartBishkekApp extends StatelessWidget {
  final bool showOnboarding;
  const SmartBishkekApp({super.key, required this.showOnboarding});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SmartBishkek',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      themeMode: ThemeMode.system,
      home: showOnboarding ? const OnboardingScreen() : const HomeScreen(),
    );
  }
}
