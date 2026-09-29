import 'package:http/http.dart' as http;
import 'package:html/parser.dart' as html_parser;
import 'package:html/dom.dart';

import '../models/imported_question.dart';

class SeekersGuidanceImporter {
  Future<ImportedQuestion> importFromUrl(String url) async {
    final response = await http.get(
      Uri.parse(url),
      headers: {
        'User-Agent': 'Mozilla/5.0 JawaabImporter/1.0',
      },
    );

    if (response.statusCode != 200) {
      throw Exception(
        "Die Webseite konnte nicht geladen werden. Status: ${response.statusCode}",
      );
    }

    final document = html_parser.parse(response.body);

    final Element content =
        document.querySelector('article') ??
        document.querySelector('.entry-content') ??
        document.querySelector('.post-content') ??
        document.querySelector('main') ??
        document.body ??
        (throw Exception("Kein Inhaltsbereich gefunden."));

    _removeNoise(content);

    final title =
        content.querySelector('h1')?.text.trim() ??
        document.querySelector('h1')?.text.trim() ??
        "Kein Titel gefunden";

    final bodyText = _normalizeText(content.text);

    final question = _extractBetween(
      bodyText,
      startMarker: "Question:",
      endMarker: "Answer:",
    );

    final answer = _extractAfter(
      bodyText,
      startMarker: "Answer:",
      stopMarkers: ["Tags:", "Related"],
    );

    final tags = _extractTags(document);

    if (question.isEmpty && answer.isEmpty) {
      throw Exception(
        "Question/Answer konnte nicht erkannt werden. Eventuell hat die Seite eine andere Struktur.",
      );
    }

    return ImportedQuestion(
      title: title,
      question: question,
      answer: answer,
      tags: tags,
    );
  }

  void _removeNoise(Element element) {
    final noiseSelectors = [
      'script',
      'style',
      'noscript',
      'iframe',
      '.share',
      '.sharedaddy',
      '.related',
      '.related-posts',
      '.post-navigation',
      '.navigation',
      '.comments',
      '.comment',
      '.advertisement',
      '.ad',
      '.ads',
      'form',
    ];

    for (final selector in noiseSelectors) {
      for (final badElement in element.querySelectorAll(selector)) {
        badElement.remove();
      }
    }
  }

  String _normalizeText(String text) {
    return text
        .replaceAll('\u00a0', ' ')
        .replaceAll(RegExp(r'[ \t]+'), ' ')
        .replaceAll(RegExp(r'\n\s*\n\s*\n+'), '\n\n')
        .trim();
  }

  String _extractBetween(
    String text, {
    required String startMarker,
    required String endMarker,
  }) {
    final start = text.indexOf(startMarker);
    final end = text.indexOf(endMarker);

    if (start == -1 || end == -1 || end <= start) {
      return "";
    }

    return text.substring(start + startMarker.length, end).trim();
  }

  String _extractAfter(
    String text, {
    required String startMarker,
    required List<String> stopMarkers,
  }) {
    final start = text.indexOf(startMarker);

    if (start == -1) {
      return "";
    }

    var end = text.length;

    for (final marker in stopMarkers) {
      final markerIndex = text.indexOf(marker, start + startMarker.length);
      if (markerIndex != -1 && markerIndex < end) {
        end = markerIndex;
      }
    }

    return text.substring(start + startMarker.length, end).trim();
  }

  List<String> _extractTags(Document document) {
    final tagElements = document.querySelectorAll('a[rel="tag"]');

    final tags = tagElements
        .map((e) => e.text.trim())
        .where((e) => e.isNotEmpty)
        .toSet()
        .toList();

    return tags;
  }
}