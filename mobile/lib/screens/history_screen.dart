import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/issue.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';
import '../theme/tokens.dart';
import '../widgets/sb_card.dart';
import '../widgets/status_badge.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  late Future<List<Issue>> _future;
  String _filter = 'all'; // all | open | closed

  @override
  void initState() {
    super.initState();
    _future = ApiService.fetchMyIssues();
  }

  Future<void> _refresh() async {
    setState(() {
      _future = ApiService.fetchMyIssues();
    });
    await _future;
  }

  bool _isOpen(Issue i) => i.status != 'resolved' && i.status != 'rejected';

  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    return SafeArea(
      bottom: false,
      child: FutureBuilder<List<Issue>>(
        future: _future,
        builder: (context, snap) {
          final all = snap.data ?? [];
          final open = all.where(_isOpen).length;
          final closed = all.length - open;
          final visible = switch (_filter) {
            'open' => all.where(_isOpen).toList(),
            'closed' => all.where((i) => !_isOpen(i)).toList(),
            _ => all,
          };
          return Column(children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 4, 20, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Мои заявки', style: context.h1.copyWith(color: p.text)),
                  const SizedBox(height: 2),
                  Text(
                    '${all.length} заявок · $open открытых · $closed закрытых',
                    style: context.bodySm.copyWith(color: p.textSoft),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
              child: Row(children: [
                _chip(context, p, 'all', 'Все', all.length),
                const SizedBox(width: 6),
                _chip(context, p, 'open', 'Открытые', open),
                const SizedBox(width: 6),
                _chip(context, p, 'closed', 'Закрытые', closed),
              ]),
            ),
            Expanded(child: RefreshIndicator(
              onRefresh: _refresh,
              child: snap.connectionState != ConnectionState.done
                ? const Center(child: CircularProgressIndicator())
                : visible.isEmpty
                  ? ListView(children: [
                      Padding(padding: const EdgeInsets.all(40),
                        child: Center(child: Text(
                          'Заявок пока нет.\nПотяните вниз, чтобы обновить.',
                          textAlign: TextAlign.center,
                          style: context.body.copyWith(color: p.textMuted),
                        )),
                      ),
                    ])
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                      itemCount: visible.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                      itemBuilder: (_, i) => _IssueCard(issue: visible[i]),
                    ),
            )),
          ]);
        },
      ),
    );
  }

  Widget _chip(BuildContext context, SBPalette p, String key, String label, int count) {
    final active = _filter == key;
    return GestureDetector(
      onTap: () => setState(() => _filter = key),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: active ? p.text : p.surface,
          border: Border.all(color: p.line),
          borderRadius: BorderRadius.circular(SBRadius.pill),
        ),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Text(label, style: context.bodySm.copyWith(
            color: active ? p.bg : p.text, fontWeight: FontWeight.w700)),
          const SizedBox(width: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 1),
            decoration: BoxDecoration(
              color: active ? p.bg.withValues(alpha: 0.2) : p.lineSoft,
              borderRadius: BorderRadius.circular(SBRadius.pill),
            ),
            child: Text('$count', style: context.caption.copyWith(
              color: active ? p.bg : p.textMuted, fontSize: 11)),
          ),
        ]),
      ),
    );
  }
}

class _IssueCard extends StatelessWidget {
  final Issue issue;
  const _IssueCard({required this.issue});

  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    final cat = SBCategory.get(issue.category);
    return SBCard(
      padding: const EdgeInsets.all(12),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        CategoryTile(issue.category ?? 'other', size: 56),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Expanded(child: Text(
              issue.description.isNotEmpty ? issue.description : cat.ru,
              maxLines: 2, overflow: TextOverflow.ellipsis,
              style: context.body.copyWith(fontWeight: FontWeight.w700, height: 1.25),
            )),
            const SizedBox(width: 8),
            StatusBadge(issue.status),
          ]),
          const SizedBox(height: 4),
          Text(
            '${issue.latitude.toStringAsFixed(4)}, ${issue.longitude.toStringAsFixed(4)}',
            maxLines: 1, overflow: TextOverflow.ellipsis,
            style: context.caption.copyWith(color: p.textMuted),
          ),
          const SizedBox(height: 6),
          Row(children: [
            Text('№${issue.id}', style: context.mono.copyWith(color: p.textMuted, fontSize: 11.5)),
            Text('  ·  ', style: context.caption.copyWith(color: p.textMuted)),
            Text(DateFormat('dd MMM').format(issue.createdAt.toLocal()),
              style: context.caption.copyWith(color: p.textMuted, fontSize: 11.5)),
          ]),
        ])),
      ]),
    );
  }
}
