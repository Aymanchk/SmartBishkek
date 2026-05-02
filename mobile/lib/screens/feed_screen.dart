import 'package:flutter/material.dart';
import '../models/issue.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';
import '../theme/tokens.dart';
import '../widgets/sb_card.dart';
import '../widgets/status_badge.dart';
import 'report/report_photo_screen.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  late Future<List<Issue>> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<List<Issue>> _load() async {
    try {
      return await ApiService.fetchAllIssues();
    } catch (_) {
      return [];
    }
  }

  Future<void> _refresh() async {
    setState(() {
      _future = _load();
    });
    await _future;
  }

  void _openReport() {
    Navigator.push(context, MaterialPageRoute(
      builder: (_) => const ReportPhotoScreen(),
      fullscreenDialog: true,
    )).then((_) => _refresh());
  }

  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    return SafeArea(
      bottom: false,
      child: RefreshIndicator(
        onRefresh: _refresh,
        child: FutureBuilder<List<Issue>>(
          future: _future,
          builder: (context, snap) {
            final issues = snap.data ?? [];
            return ListView(
              padding: const EdgeInsets.fromLTRB(0, 4, 0, 16),
              physics: const AlwaysScrollableScrollPhysics(),
              children: [
                _Header(p: p),
                const SizedBox(height: 12),
                _CtaCard(onTap: _openReport, p: p),
                const SizedBox(height: 12),
                _Stats(p: p, total: issues.length, resolved: issues.where((i) => i.status == 'resolved').length),
                const SizedBox(height: 16),
                _Section(title: 'Рядом с вами'),
                if (snap.connectionState != ConnectionState.done)
                  const Padding(padding: EdgeInsets.all(40),
                    child: Center(child: CircularProgressIndicator()),
                  )
                else if (issues.isEmpty)
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Center(child: Text(
                      'Заявок пока нет.\nПервым сообщите о проблеме.',
                      textAlign: TextAlign.center,
                      style: context.body.copyWith(color: p.textMuted),
                    )),
                  )
                else
                  ...issues.take(8).map((it) => Padding(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                    child: _IssueRow(issue: it),
                  )),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  final SBPalette p;
  const _Header({required this.p});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Привет, Айбек 👋',
                    style: context.bodySm.copyWith(color: p.textMuted, fontWeight: FontWeight.w500)),
                const SizedBox(height: 2),
                Text('Что произошло сегодня?', style: context.h2.copyWith(color: p.text)),
              ],
            ),
          ),
          Container(
            width: 40, height: 40,
            decoration: BoxDecoration(
              color: p.surface, shape: BoxShape.circle,
              border: Border.all(color: p.line),
            ),
            child: Stack(children: [
              Center(child: Icon(Icons.notifications_outlined, size: 20, color: p.text)),
              Positioned(
                top: 8, right: 9,
                child: Container(
                  width: 8, height: 8,
                  decoration: BoxDecoration(
                    color: SBColors.danger500, shape: BoxShape.circle,
                    border: Border.all(color: p.surface, width: 2),
                  ),
                ),
              ),
            ]),
          ),
        ],
      ),
    );
  }
}

class _CtaCard extends StatelessWidget {
  final VoidCallback onTap;
  final SBPalette p;
  const _CtaCard({required this.onTap, required this.p});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft, end: Alignment.bottomRight,
              colors: p.dark
                ? const [SBColors.navy800, SBColors.navy900]
                : const [SBColors.navy700, SBColors.navy800],
            ),
            borderRadius: BorderRadius.circular(16),
            boxShadow: SBShadow.md,
          ),
          child: Row(
            children: [
              Container(
                width: 52, height: 52,
                decoration: BoxDecoration(
                  color: SBColors.amber500,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(Icons.camera_alt_rounded, color: Color(0xFF3A2900), size: 26),
              ),
              const SizedBox(width: 14),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Сообщить о проблеме',
                      style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700)),
                    SizedBox(height: 2),
                    Text('1 фото · 30 секунд',
                      style: TextStyle(color: Colors.white70, fontSize: 12.5)),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_rounded, color: Colors.white),
            ],
          ),
        ),
      ),
    );
  }
}

class _Stats extends StatelessWidget {
  final SBPalette p;
  final int total, resolved;
  const _Stats({required this.p, required this.total, required this.resolved});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(children: [
        Expanded(child: _statCard(
          context, dotColor: SBColors.amber500,
          label: '$total активных',
          big: 'В Бишкеке сейчас',
        )),
        const SizedBox(width: 10),
        Expanded(child: _statCard(
          context, dotColor: SBColors.success500,
          label: '$resolved решено',
          big: '↑ 18%', bigColor: SBColors.success700,
        )),
      ]),
    );
  }

  Widget _statCard(BuildContext context, {required Color dotColor, required String label, required String big, Color? bigColor}) {
    return SBCard(
      padding: const EdgeInsets.all(12),
      radius: 12,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Container(width: 8, height: 8, decoration: BoxDecoration(color: dotColor, shape: BoxShape.circle)),
          const SizedBox(width: 6),
          Text(label, style: context.caption.copyWith(color: p.textMuted, fontSize: 11.5, fontWeight: FontWeight.w600)),
        ]),
        const SizedBox(height: 6),
        Text(big, style: context.h2.copyWith(fontSize: 20, color: bigColor ?? p.text)),
      ]),
    );
  }
}

class _Section extends StatelessWidget {
  final String title;
  const _Section({required this.title});
  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 4, 20, 8),
      child: Text(title.toUpperCase(),
        style: context.micro.copyWith(color: p.textSoft, letterSpacing: 0.6)),
    );
  }
}

class _IssueRow extends StatelessWidget {
  final Issue issue;
  const _IssueRow({required this.issue});
  @override
  Widget build(BuildContext context) {
    final p = SBPalette.of(context);
    return SBCard(
      padding: const EdgeInsets.all(12),
      radius: 12,
      child: Row(children: [
        CategoryTile(issue.category ?? 'other'),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(issue.description.isNotEmpty ? issue.description : SBCategory.get(issue.category).ru,
            maxLines: 1, overflow: TextOverflow.ellipsis,
            style: context.body.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 2),
          Text('№${issue.id} · ${_relTime(issue.createdAt)}',
            style: context.caption.copyWith(color: p.textMuted, fontSize: 12)),
        ])),
        const SizedBox(width: 8),
        StatusBadge(issue.status),
      ]),
    );
  }

  String _relTime(DateTime d) {
    final diff = DateTime.now().difference(d);
    if (diff.inMinutes < 60) return '${diff.inMinutes} мин';
    if (diff.inHours < 24) return '${diff.inHours} ч';
    return '${diff.inDays} д';
  }
}
