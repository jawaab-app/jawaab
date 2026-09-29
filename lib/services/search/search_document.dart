class SearchDocument {
  final List<String> title;
  final List<String> content;
  final List<String> tags;
  final List<String> scholar;
  final List<String> source;

  SearchDocument({
    required this.title,
    required this.content,
    required this.tags,
    required this.scholar,
    required this.source,
  });

  List<String> get allTokens => [
        ...title,
        ...content,
        ...tags,
        ...scholar,
        ...source,
      ];

  int get length => allTokens.length;

  double termFrequency(String token) {
    return _count(title, token) * 5.0 +
        _count(tags, token) * 4.0 +
        _count(scholar, token) * 2.0 +
        _count(source, token) +
        _count(content, token);
  }

  int _count(
    List<String> tokens,
    String token,
  ) {
    int count = 0;

    for (final currentToken in tokens) {
      if (currentToken == token) {
        count++;
      }
    }

    return count;
  }
}