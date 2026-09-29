import 'dart:math';

import 'bm25_scorer.dart';
import 'search_document.dart';

class SearchService {
  final Bm25Scorer _bm25Scorer = Bm25Scorer();

  List<Map<String, String>> search(
    String keyword,
    List<Map<String, String>> source,
    String madhab,
  ) {
    final queryTokens = _tokenize(keyword);

    if (queryTokens.isEmpty) {
      final results =
          List<Map<String, String>>.from(source);

      _sortByMadhab(results, madhab);

      return results;
    }

    final documents =
        source.map(_buildDocument).toList();

    final scores = _bm25Scorer.score(
      queryTokens: queryTokens,
      documents: documents,
    );

    final scoredResults = <_ScoredResult>[];

    for (int i = 0; i < source.length; i++) {
      final score = scores[i];

      if (score > 0) {
        scoredResults.add(
          _ScoredResult(
            result: source[i],
            score: score,
          ),
        );
      }
    }

    scoredResults.sort((a, b) {
      final scoreComparison =
          b.score.compareTo(a.score);

      if (scoreComparison != 0) {
        return scoreComparison;
      }

      final aMadhab =
          a.result['madhab_herkunft'] == madhab;

      final bMadhab =
          b.result['madhab_herkunft'] == madhab;

      if (aMadhab && !bMadhab) {
        return -1;
      }

      if (!aMadhab && bMadhab) {
        return 1;
      }

      return (a.result['titel'] ?? '')
          .compareTo(b.result['titel'] ?? '');
    });

    return scoredResults
        .map((result) => result.result)
        .toList();
  }

  SearchDocument _buildDocument(
    Map<String, String> beitrag,
  ) {
    return SearchDocument(
      title: _tokenize(beitrag['titel'] ?? ''),
      content: _tokenize(beitrag['inhalt'] ?? ''),
      tags: _tokenize(beitrag['tags'] ?? ''),
      scholar: _tokenize(beitrag['scholar'] ?? ''),
      source: _tokenize(beitrag['source'] ?? ''),
    );
  }

  double semanticSimilarity(
    List<double> queryEmbedding,
    List<double> documentEmbedding,
  ) {
    if (queryEmbedding.length !=
        documentEmbedding.length) {
      return 0;
    }

    if (queryEmbedding.isEmpty) {
      return 0;
    }

    double dotProduct = 0;
    double queryMagnitude = 0;
    double documentMagnitude = 0;

    for (int i = 0; i < queryEmbedding.length; i++) {
      dotProduct +=
          queryEmbedding[i] * documentEmbedding[i];

      queryMagnitude +=
          queryEmbedding[i] * queryEmbedding[i];

      documentMagnitude +=
          documentEmbedding[i] *
              documentEmbedding[i];
    }

    if (queryMagnitude == 0 ||
        documentMagnitude == 0) {
      return 0;
    }

    return dotProduct /
        (sqrt(queryMagnitude) *
            sqrt(documentMagnitude));
  }

  List<String> _tokenize(String text) {
    final normalized = _normalizeSearchText(text);

    if (normalized.isEmpty) {
      return [];
    }

    return normalized
        .split(' ')
        .where((token) => token.isNotEmpty)
        .toList();
  }

  String _normalizeSearchText(String text) {
    return text
        .toLowerCase()
        .replaceAll('ä', 'ae')
        .replaceAll('ö', 'oe')
        .replaceAll('ü', 'ue')
        .replaceAll('ß', 'ss')
        .replaceAll(
          RegExp(r'[^a-z0-9\s]'),
          ' ',
        )
        .replaceAll(
          RegExp(r'\s+'),
          ' ',
        )
        .trim();
  }

  void _sortByMadhab(
    List<Map<String, String>> results,
    String madhab,
  ) {
    results.sort((a, b) {
      final aPrioritized =
          a['madhab_herkunft'] == madhab;

      final bPrioritized =
          b['madhab_herkunft'] == madhab;

      if (aPrioritized && !bPrioritized) {
        return -1;
      }

      if (!aPrioritized && bPrioritized) {
        return 1;
      }

      return 0;
    });
  }
}

class _ScoredResult {
  final Map<String, String> result;
  final double score;

  _ScoredResult({
    required this.result,
    required this.score,
  });
}