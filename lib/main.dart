import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'services/seekers_guidance_importer.dart';
import 'services/search/search_service.dart';

// ===========================================================================
// DATEN-LADEKLASSE
// ===========================================================================

class ContentLoader {
  static final Map<String, Map<String, String>> _assetPaths = {
    'Hanafi': {
      'Reinheit': 'assets/data/hanafi/reinheit.json',
      'Gebet': 'assets/data/hanafi/gebet.json',
      'Fasten': 'assets/data/hanafi/fasten.json',
      'Zakah': 'assets/data/hanafi/zakah.json',
      'Hajj/Umrah': 'assets/data/hanafi/hajj.json',
      'Schwur/Gelübde': 'assets/data/hanafi/schwur.json',
      'Opfertiere': 'assets/data/hanafi/opfertiere.json',
      'Eherecht': 'assets/data/hanafi/eherecht.json',
      'Handelsrecht': 'assets/data/hanafi/handelsrecht.json',
    },
    'Maliki': {
      'Reinheit': 'assets/data/maliki/reinheit.json',
      'Gebet': 'assets/data/maliki/gebet.json',
      'Fasten': 'assets/data/maliki/fasten.json',
      'Zakah': 'assets/data/maliki/zakah.json',
      'Hajj/Umrah': 'assets/data/maliki/hajj.json',
      'Schwur/Gelübde': 'assets/data/maliki/schwur.json',
      'Opfertiere': 'assets/data/maliki/opfertiere.json',
      'Eherecht': 'assets/data/maliki/eherecht.json',
      'Handelsrecht': 'assets/data/maliki/handelsrecht.json',
    },
    'Shafi\'i': {
      'Reinheit': 'assets/data/shafii/reinheit.json',
      'Gebet': 'assets/data/shafii/gebet.json',
      'Fasten': 'assets/data/shafii/fasten.json',
      'Zakah': 'assets/data/shafii/zakah.json',
      'Hajj/Umrah': 'assets/data/shafii/hajj.json',
      'Schwur/Gelübde': 'assets/data/shafii/schwur.json',
      'Opfertiere': 'assets/data/shafii/opfertiere.json',
      'Eherecht': 'assets/data/shafii/eherecht.json',
      'Handelsrecht': 'assets/data/shafii/handelsrecht.json',
    },
    'Hanbali': {
      'Reinheit': 'assets/data/hanbali/reinheit.json',
      'Gebet': 'assets/data/hanbali/gebet.json',
      'Fasten': 'assets/data/hanbali/fasten.json',
      'Zakah': 'assets/data/hanbali/zakah.json',
      'Hajj/Umrah': 'assets/data/hanbali/hajj.json',
      'Schwur/Gelübde': 'assets/data/hanbali/schwur.json',
      'Opfertiere': 'assets/data/hanbali/opfertiere.json',
      'Eherecht': 'assets/data/hanbali/eherecht.json',
      'Handelsrecht': 'assets/data/hanbali/handelsrecht.json',
    },
    'Kein Madhab': {
      'Grundlagen': 'assets/data/lamadhab/grundlagen.json',
      'Was ist ein Madhab?': 'assets/data/lamadhab/madhab.json',
    },
  };

  static Future<List<Map<String, String>>> loadBeitraegeFuerThema(String madhab, String thema) async {
    final path = _assetPaths[madhab]?[thema];
    if (path == null) {
      debugPrint('Kein manueller Pfad für $madhab -> $thema definiert.');
      return [];
    }
    try {
      final jsonString = await rootBundle.loadString(path);
      final List<dynamic> jsonList = json.decode(jsonString);
      return jsonList.map((item) => Map<String, String>.from(item)).toList();
    } catch (e) {
      debugPrint('FEHLER BEIM LADEN DER DATEI: $path. Fehlermeldung: $e');
      return [];
    }
  }

  // Lädt IMMER die Beiträge ALLER Madahib für eine globale Suche.
  static Future<List<Map<String, String>>> loadAlleBeitraege() async {
    // Liste aller Madahib, die durchsucht werden sollen.
    final madahibToSearch = ['Hanafi', 'Maliki', 'Shafi\'i', 'Hanbali', 'Kein Madhab'];
    final List<Map<String, String>> allPosts = [];

    for (final m in madahibToSearch) {
      final paths = _assetPaths[m]?.values.toList() ?? [];
      for (final path in paths) {
        final posts = await _loadEinzelneDatei(path);
        for (final post in posts) {
          // Fügt jedem Beitrag hinzu, woher er stammt.
          post['madhab_herkunft'] = m;
          allPosts.add(post);
        }
      }
    }
    return allPosts;
  }
  
  static Future<List<Map<String, String>>> _loadEinzelneDatei(String path) async {
    try {
      final jsonString = await rootBundle.loadString(path);
      final List<dynamic> jsonList = json.decode(jsonString);
      return jsonList.map((item) => Map<String, String>.from(item)).toList();
    } catch (e) {
      return [];
    }
  }
}


// ===========================================================================
// THEME & STATE MANAGEMENT (Provider)
// ===========================================================================
class ThemeProvider with ChangeNotifier {
  String _selectedMadhab = 'Kein Madhab';
  ThemeData _currentTheme = AppThemes.getTheme('Kein Madhab');
  bool _isInitialized = false;

  String get selectedMadhab => _selectedMadhab;
  ThemeData get currentTheme => _currentTheme;
  bool get isInitialized => _isInitialized;

  ThemeProvider() { _loadMadhab(); }

  Future<void> _loadMadhab() async {
    final prefs = await SharedPreferences.getInstance();
    _selectedMadhab = prefs.getString('selectedMadhab') ?? 'UNBEKANNT';
    _currentTheme = AppThemes.getTheme(_selectedMadhab);
    _isInitialized = true;
    notifyListeners();
  }

  Future<void> setMadhab(String madhab) async {
    _selectedMadhab = madhab;
    _currentTheme = AppThemes.getTheme(madhab);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('selectedMadhab', madhab);
    notifyListeners();
  }
}

// ===========================================================================
// THEME DEFINITIONEN
// ===========================================================================
class AppThemes {
  static ThemeData getTheme(String madhab) {
    Color seedColor;
    Color scaffoldColor;
    switch (madhab) {
      case 'Hanafi': seedColor = const Color(0xFFC06C5D); scaffoldColor = const Color(0xFFF9F1EF); break;
      case 'Maliki': seedColor = const Color(0xFFD4A056); scaffoldColor = const Color(0xFFFFF9F0); break;
      case 'Shafi\'i': seedColor = const Color(0xFF5A7D9A); scaffoldColor = const Color(0xFFEFF3F6); break;
      case 'Hanbali': seedColor = const Color(0xFF7E8D67); scaffoldColor = const Color(0xFFF4F6F2); break;
      default: seedColor = const Color(0xFF8E829B); scaffoldColor = const Color(0xFFF6F4F7);
    }
    final baseTheme = ThemeData(useMaterial3: true, colorScheme: ColorScheme.fromSeed(seedColor: seedColor, brightness: Brightness.light));
    return baseTheme.copyWith(
      scaffoldBackgroundColor: scaffoldColor,
      appBarTheme: baseTheme.appBarTheme.copyWith(backgroundColor: scaffoldColor, foregroundColor: Colors.grey[800], elevation: 0, scrolledUnderElevation: 1.0, iconTheme: IconThemeData(color: Colors.grey[800]), actionsIconTheme: IconThemeData(color: Colors.grey[800])),
      cardTheme: baseTheme.cardTheme.copyWith(elevation: 0, color: scaffoldColor, surfaceTintColor: Colors.transparent),
    );
  }
}

// ===========================================================================
// APP STARTPUNKT
// ==========================================================================
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(ChangeNotifierProvider(create: (_) => ThemeProvider(), child: const MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, child) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Jawāb App',
          theme: themeProvider.currentTheme,
          home: !themeProvider.isInitialized
              ? const Scaffold(body: Center(child: CircularProgressIndicator()))
              : themeProvider.selectedMadhab == 'UNBEKANNT'
                  ? const MadhabSelectionScreen()
                  : const HomeScreen(),
        );
      },
    );
  }
}

// ===========================================================================
// SCREEN 1: MADHAB AUSWAHL
// ===========================================================================
class MadhabSelectionScreen extends StatelessWidget {
  const MadhabSelectionScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('Wähle deine Rechtsschule', textAlign: TextAlign.center, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              const SizedBox(height: 40),
              _MadhabButton(madhab: 'Hanafi', color: const Color(0xFFC06C5D)),
              _MadhabButton(madhab: 'Maliki', color: const Color(0xFFD4A056)),
              _MadhabButton(madhab: 'Shafi\'i', color: const Color(0xFF5A7D9A)),
              _MadhabButton(madhab: 'Hanbali', color: const Color(0xFF7E8D67)),
              _MadhabButton(madhab: 'Kein Madhab', color: const Color(0xFF8E829B)),
            ],
          ),
        ),
      ),
    );
  }
}

class _MadhabButton extends StatelessWidget {
  final String madhab;
  final Color color;
  const _MadhabButton({required this.madhab, required this.color});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(backgroundColor: color, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
        onPressed: () => Provider.of<ThemeProvider>(context, listen: false).setMadhab(madhab),
        child: Text(madhab, style: const TextStyle(fontSize: 18)),
      ),
    );
  }
}

// ===========================================================================
// SCREEN 2: HOME
// ===========================================================================
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final madhab = Provider.of<ThemeProvider>(context).selectedMadhab;
    
    final List<String> themenKacheln = ContentLoader._assetPaths[madhab]?.keys.toList() ?? [];

    themenKacheln.add("Kontakt");

    return Scaffold(
      drawer: const AppDrawer(),
      appBar: AppBar(
        centerTitle: true,

        actions: [
          IconButton(
            icon: const Icon(Icons.download),
            onPressed: () async {
              final controller = TextEditingController();

              final url = await showDialog<String>(
                context: context,
                builder: (context) {
                  return AlertDialog(
                    title: const Text("SeekersGuidance importieren"),
                    content: TextField(
                      controller: controller,
                      decoration: const InputDecoration(
                        labelText: "URL",
                        hintText:
                            "https://seekersguidance.org/answers/...",
                      ),
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text("Abbrechen"),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pop(
                            context,
                            controller.text.trim(),
                          );
                        },
                        child: const Text("Importieren"),
                      ),
                    ],
                  );
                },
              );

              if (url == null || url.isEmpty) {
                return;
              }

              try {
                final importer = SeekersGuidanceImporter();

                final result =
                    await importer.importFromUrl(url);

                showDialog(
                  context: context,
                  builder: (context) {
                    return AlertDialog(
                      title: const Text("Import erfolgreich"),
                      content: SizedBox(
                        width: double.maxFinite,
                        child: SingleChildScrollView(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [

                              const Text(
                                "Titel",
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              Text(result.title),

                              const SizedBox(height: 16),

                              const Text(
                                "Frage",
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              Text(result.question),

                              const SizedBox(height: 16),

                              const Text(
                                "Antwort",
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              Text(result.answer),

                              const SizedBox(height: 16),

                              const Text(
                                "Tags",
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              Text(result.tags.join(", ")),
                            ],
                          ),
                        ),
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text("Schließen"),
                        ),
                      ],
                    );
                  },
                );
              } catch (e) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(e.toString()),
                  ),
                );
              }
            },
          ),
        ],
        title: Row(
          mainAxisSize: MainAxisSize.min, // Hält die Row kompakt
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic, // Richtet Texte an der Grundlinie aus
          children: [
            const Text(
              'Jawāb',
              style: TextStyle(
                fontFamily: 'DancingScript', 
                fontSize: 58,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(width: 8), // Kleiner Abstand
            // Zeigt den Madhab nur an, wenn es nicht "Kein Madhab" ist
            if (madhab != 'Kein Madhab')
              Padding(
                padding: const EdgeInsets.only(top: 4.0), // Justiert die vertikale Position
                child: Text(
                  madhab,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey[600],
                  ),
                ),
              ),
          ],
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0),
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 18.0),
                child: NeumorphicTile(
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => SearchPage(madhab: madhab))),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.search, color: Theme.of(context).colorScheme.primary),
                      const SizedBox(width: 12),
                      Text('Durchsuchen', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: Colors.grey[700])),
                    ],
                  ),
                ),
              ),
            ),
            SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, crossAxisSpacing: 16, mainAxisSpacing: 16, childAspectRatio: 1.1),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final thema = themenKacheln[index];
                  String? bildPfad;
                  if (thema == "Reinheit") bildPfad = 'assets/images/Reinheit.jpg';
                  else if (thema == "Gebet") bildPfad = 'assets/images/Gebet.png';
                  else if (thema == "Fasten") bildPfad = 'assets/images/Fasten.png';
                  else if (thema == "Zakah") bildPfad = 'assets/images/Zakah.png';
                  else if (thema == "Hajj/Umrah") bildPfad = 'assets/images/Hajj_Umrah.png';
                  else if (thema == "Eherecht") bildPfad = "assets/images/Ehe.png";
                  else if (thema == "Opfertiere") bildPfad = 'assets/images/Opfertiere.png';
                  else if (thema == "Handelsrecht") bildPfad = 'assets/images/Handelsrecht.png';
                  else if (thema == "Schwur/Gelübde") bildPfad = "assets/images/Schwur.png";
                  else if (thema == "Kontakt") bildPfad = "assets/images/Kontakt.png";
                  else if (thema == "Was ist ein Madhab?") bildPfad = "assets/images/schule.png";
                  else if (thema == "Grundlagen") bildPfad = "assets/images/Grundlagen.png";
                  
                  

                  final bool hatBild = bildPfad != null;
                  final Color textFarbe = hatBild ? Colors.white : Colors.grey[800]!;
                  final List<Shadow>? textSchatten = hatBild ? [Shadow(blurRadius: 4, color: Colors.black.withOpacity(0.7))] : null;

                  return NeumorphicTile(
                    imagePath: bildPfad,
                    onTap: () {
                      if (thema == 'Kontakt') Navigator.push(context, MaterialPageRoute(builder: (context) => const KontaktSeite()));
                      else Navigator.push(context, MaterialPageRoute(builder: (context) => BeitragsSeite(madhab: madhab, thema: thema)));
                    },
                    child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [Text(thema, textAlign: TextAlign.center, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: textFarbe, shadows: textSchatten))]),
                  );
                },
                childCount: themenKacheln.length,
              ),
            ),
          ],
        ),
      ),
    );
  }
}


// ===========================================================================
// WIDGETS (NEUMORPHIC TILE & DRAWER)
// ===========================================================================
class NeumorphicTile extends StatelessWidget {
  final Widget child;
  final VoidCallback onTap;
  final String? imagePath;
  const NeumorphicTile({super.key, required this.child, required this.onTap, this.imagePath});
  @override
  Widget build(BuildContext context) {
    final backgroundColor = Theme.of(context).scaffoldBackgroundColor;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(15),
          image: imagePath != null ? DecorationImage(image: AssetImage(imagePath!), fit: BoxFit.cover, colorFilter: ColorFilter.mode(Colors.black.withOpacity(0.35), BlendMode.darken)) : null,
          boxShadow: [BoxShadow(color: Colors.grey.shade400, offset: const Offset(4, 4), blurRadius: 15, spreadRadius: 1), const BoxShadow(color: Colors.white, offset: Offset(-4, -4), blurRadius: 15, spreadRadius: 1)],
        ),
        child: child,
      ),
    );
  }
}

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});
  @override
  Widget build(BuildContext context) {
    // --- ÄNDERUNG 1: Wir verwenden einen Consumer ---
    // Dieser sorgt dafür, dass sich der Drawer neu aufbaut, wenn sich der Madhab ändert.
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, child) {
        final madhab = themeProvider.selectedMadhab;
        String headerImagePath;
        switch (madhab) {
          case 'Hanafi': headerImagePath = 'assets/images/HanafiHeader.png'; break;
          case 'Maliki': headerImagePath = 'assets/images/MalikiHeader.png'; break;
          case 'Shafi\'i': headerImagePath = 'assets/images/ShafiiHeader.png'; break;
          case 'Hanbali': headerImagePath = 'assets/images/HanbaliHeader.png'; break;
          default: headerImagePath = 'assets/images/default_header.png';
        }

        return Drawer(
          child: ListView(
            padding: EdgeInsets.zero,
            children: [
              DrawerHeader(
                padding: const EdgeInsets.all(16.0), // Padding für die Ausrichtung
                decoration: BoxDecoration(image: DecorationImage(image: AssetImage(headerImagePath), fit: BoxFit.cover)),
                // --- ÄNDERUNG 2: Text-Position und Stil ---
                child: const Align(
                  alignment: Alignment.bottomLeft,
                  child: Text(
                    'Menü',
                    style: TextStyle(
                      color: Colors.black, // Schwarze Schrift
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      shadows: [Shadow(blurRadius: 2, color: Colors.white, offset: Offset(1,1))], // Heller Schatten für Kontrast
                    ),
                  ),
                ),
              ),
              const Padding(padding: EdgeInsets.fromLTRB(16, 16, 16, 8), child: Text('Rechtsschulen', style: TextStyle(fontWeight: FontWeight.bold))),
              ListTile(title: const Text('Hanafi'), onTap: () => themeProvider.setMadhab('Hanafi')),
              ListTile(title: const Text('Maliki'), onTap: () => themeProvider.setMadhab('Maliki')),
              ListTile(title: const Text('Shafi\'i'), onTap: () => themeProvider.setMadhab('Shafi\'i')),
              ListTile(title: const Text('Hanbali'), onTap: () => themeProvider.setMadhab('Hanbali')),
              ListTile(title: const Text("Kein Madhab"), onTap: () => themeProvider.setMadhab('Kein Madhab')),
              const Divider(),
                              
              ListTile(leading: const Icon(Icons.settings), title: const Text('Einstellungen'), onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const EinstellungenSeite()))),
              ListTile(leading: const Icon(Icons.contact_mail), title: const Text('Kontakt'), onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const KontaktSeite()))),
              ListTile(leading: const Icon(Icons.group), title: const Text('Über Uns'), onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const UeberUnsSeite()))),
              ListTile(leading: const Icon(Icons.help_rounded), title: const Text('Hilfe'), onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const HilfeSeite()))),
              ListTile(leading: const Icon(Icons.info), title: const Text('Impressum'), onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const ImpressumSeite()))),
              
            ],
          ),
        );
      },
    );
  }
}

// ===========================================================================
// ANGEPASSTE INHALTS- & SUCHSEITEN
// ===========================================================================
class BeitragsSeite extends StatelessWidget {
  final String madhab;
  final String thema;
  const BeitragsSeite({super.key, required this.madhab, required this.thema});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(thema)),
      body: FutureBuilder<List<Map<String, String>>>(
        future: ContentLoader.loadBeitraegeFuerThema(madhab, thema),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
          if (snapshot.hasError) return Center(child: Text('Fehler beim Laden der Beiträge: ${snapshot.error}'));
          if (snapshot.hasData) {
            final beitraege = snapshot.data!;
            if (beitraege.isEmpty) return const Center(child: Text('Für dieses Thema gibt es noch keine Beiträge.'));
            return ListView.builder(
              padding: const EdgeInsets.all(8.0),
              itemCount: beitraege.length,
              itemBuilder: (context, index) {
                final beitrag = beitraege[index];
                return Card(
                  margin: const EdgeInsets.symmetric(vertical: 8.0),
                  elevation: 2,
                  child: ListTile(
                    title: Text(beitrag['titel']!, style: const TextStyle(fontWeight: FontWeight.bold)),
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => BeitragsDetailSeite(beitrag: beitrag))),
                  ),
                );
              },
            );
          }
          return const Center(child: Text('Etwas ist schiefgelaufen.'));
        },
      ),
    );
  }
}

class SearchPage extends StatefulWidget {
  final String madhab;
  const SearchPage({super.key, required this.madhab});
  @override _SearchPageState createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final List<Map<String, String>> _kompletteListe = []; 
  List<Map<String, String>> _gefundeneBeitraege = [];
  late Future<void> _ladeFuture;

  final SearchService _searchService = SearchService();

  @override
  void initState() {
    super.initState();
    _ladeFuture = _ladeAlleBeitraegeFuerMadhab();
  }

  Future<void> _ladeAlleBeitraegeFuerMadhab() async {
    final alleBeitraege = await ContentLoader.loadAlleBeitraege();
    if (mounted) {
      setState(() {
        _kompletteListe.addAll(alleBeitraege);
        _gefundeneBeitraege.addAll(alleBeitraege);
      });
    }
  }

String normalizeSearchText(String text) {
  return text
      .toLowerCase()
      .replaceAll('ä', 'ae')
      .replaceAll('ö', 'oe')
      .replaceAll('ü', 'ue')
      .replaceAll('ß', 'ss')
      .replaceAll(RegExp(r'[^a-z0-9\s]'), ' ')
      .replaceAll(RegExp(r'\s+'), ' ')
      .trim();
}



void _runFilter(String keyword) {
  final results = _searchService.search(
    keyword,
    _kompletteListe,
    widget.madhab,
  );

  setState(() {
    _gefundeneBeitraege = results;
  });
}
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          onChanged: _runFilter,
          autofocus: true,
          decoration: const InputDecoration(hintText: 'Global suchen...', border: InputBorder.none),
        ),
      ),
      body: FutureBuilder(
        future: _ladeFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
          if (snapshot.hasError) return Center(child: Text("Fehler beim Laden der Suchdaten: ${snapshot.error}"));
          if (_gefundeneBeitraege.isEmpty && _kompletteListe.isNotEmpty) return const Center(child: Text("Keine Beiträge für deine Suche gefunden."));
          
          return ListView.builder(
            itemCount: _gefundeneBeitraege.length,
            itemBuilder: (context, index) {
              final beitrag = _gefundeneBeitraege[index];
              final herkunft = beitrag['madhab_herkunft'];

              return Card(
                margin: const EdgeInsets.all(8),
                elevation: 2,
                child: ListTile(
                  title: Text(beitrag['titel']!),
                  subtitle: (herkunft != null && herkunft != 'Kein Madhab')
                      ? Text(
                          herkunft,
                          style: TextStyle(
                              fontWeight: FontWeight.w500,
                              color: Theme.of(context).colorScheme.primary.withOpacity(0.8),
                          ),
                        )
                      : null,
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => BeitragsDetailSeite(beitrag: beitrag))),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class BeitragsDetailSeite extends StatelessWidget {
  final Map<String, String> beitrag;
  const BeitragsDetailSeite({super.key, required this.beitrag});
  @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: Text(beitrag['titel']!)), body: SingleChildScrollView(padding: const EdgeInsets.all(16.0), child: Text(beitrag['inhalt']!, style: const TextStyle(fontSize: 16))));
}
class KontaktSeite extends StatelessWidget {
  const KontaktSeite({super.key});
  @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Kontakt')), body: const Center(child: 
  Text('Falls du Fragen oder Anliegen hast kontaktiere uns unter info@jawaab.de',
  textAlign: TextAlign.center,
  style: TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w700,
    color: Colors.black54,
    fontStyle: FontStyle.italic,
    height: 1.5,
  ))));
}
class ImpressumSeite extends StatelessWidget {
  const ImpressumSeite({super.key});
  @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Impressum')), body: const Center(child: Text('Impressum-Text')));
}
class EinstellungenSeite extends StatelessWidget {
  const EinstellungenSeite({super.key});
  @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Einstellungen')), body: const Center(child: Text('Einstellungsoptionen')));
}
class UeberUnsSeite extends StatelessWidget {
  const UeberUnsSeite({super.key});
  @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Über Uns')), body: const Center(child: Text('Informationen über die App und die Entwickler.')));
}
class HilfeSeite extends StatelessWidget {
  const HilfeSeite({super.key});
  @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Hilfe')), body: const Center(child: Text('Informationen zur Hilfe und Support.')));
}