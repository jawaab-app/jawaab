import 'dart:math';

import 'search_document.dart';

class Bm25Scorer {
  static const double k1 = 1.2;
  static const double b = 0.75;

  List<double> score({
    required List<String> queryTokens,
    required List<SearchDocument> documents,
  }) {
    if (documents.isEmpty) {
      return [];
    }

    final documentFrequency = <String, int>{};

    for (final document in documents) {
      final uniqueTokens = document.allTokens.toSet();

      for (final token in uniqueTokens) {
        documentFrequency[token] =
            (documentFrequency[token] ?? 0) + 1;
      }
    }

    final documentCount = documents.length;

    final averageDocumentLength =
        documents
                .map((document) => document.length)
                .reduce((a, b) => a + b) /
            documentCount;

    return documents.map((document) {
      return _scoreDocument(
        queryTokens: queryTokens,
        document: document,
        documentFrequency: documentFrequency,
        documentCount: documentCount,
        averageDocumentLength: averageDocumentLength,
      );
    }).toList();
  }

  double _scoreDocument({
    required List<String> queryTokens,
    required SearchDocument document,
    required Map<String, int> documentFrequency,
    required int documentCount,
    required double averageDocumentLength,
  }) {
    if (document.length == 0 ||
        averageDocumentLength == 0) {
      return 0;
    }

    double score = 0;

    for (final token in queryTokens.toSet()) {
      final df = documentFrequency[token] ?? 0;

      if (df == 0) {
        continue;
      }

      final idf = log(
        1 +
            (documentCount - df + 0.5) /
                (df + 0.5),
      );

      final termFrequency =
          document.termFrequency(token);

      if (termFrequency == 0) {
        continue;
      }

      final lengthNormalization =
          1 -
          b +
          b *
              (document.length /
                  averageDocumentLength);

      final numerator =
          termFrequency * (k1 + 1);

      final denominator =
          termFrequency +
          k1 * lengthNormalization;

      score +=
          idf *
          (numerator / denominator);
    }

    return score;
  }
}