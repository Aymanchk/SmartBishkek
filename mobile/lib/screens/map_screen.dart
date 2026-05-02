import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../services/api_service.dart';
import '../services/location_service.dart';
import '../models/issue.dart';
import '../theme/app_theme.dart';
import '../theme/tokens.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  late Future<List<Issue>> _issuesFuture;
  LatLng? _userLocation;

  @override
  void initState() {
    super.initState();
    _issuesFuture = ApiService.fetchAllIssues();
    _getUserLocation();
  }

  Future<void> _getUserLocation() async {
    try {
      final pos = await LocationService.getCurrentPosition();
      if (mounted) {
        setState(() {
          _userLocation = LatLng(pos.latitude, pos.longitude);
        });
      }
    } catch (e) {
      // Handle or ignore
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    final initialCenter = _userLocation ?? const LatLng(42.8746, 74.5698); // Bishkek

    return FutureBuilder<List<Issue>>(
      future: _issuesFuture,
      builder: (context, snapshot) {
        final issues = snapshot.data ?? [];
        
        return FlutterMap(
          options: MapOptions(
            initialCenter: initialCenter,
            initialZoom: 13.0,
          ),
          children: [
            TileLayer(
              urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              userAgentPackageName: 'com.example.smartbishkek',
            ),
            MarkerLayer(
              markers: [
                if (_userLocation != null)
                  Marker(
                    point: _userLocation!,
                    width: 40,
                    height: 40,
                    child: Container(
                      decoration: BoxDecoration(
                        color: p.primary.withValues(alpha: 0.2),
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Container(
                          width: 16, height: 16,
                          decoration: BoxDecoration(
                            color: p.primary,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ),
                  ),
                ...issues.map((issue) {
                  return Marker(
                    point: LatLng(issue.latitude, issue.longitude),
                    width: 40,
                    height: 40,
                    child: GestureDetector(
                      onTap: () {
                        // TODO: Show issue details bottom sheet
                      },
                      child: Icon(
                        Icons.location_on,
                        color: issue.status == 'resolved' ? SBColors.success500 : SBColors.danger500,
                        size: 32,
                      ),
                    ),
                  );
                }),
              ],
            ),
          ],
        );
      },
    );
  }
}
