import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String? htmlContent;
  final GlobalKey webViewKey = GlobalKey();
  InAppWebViewController? webViewController;
  String? localDirPath;

  @override
  void initState() {
    super.initState();
    if (kIsWeb) {
      rootBundle.loadString('assets/index.html').then((content) {
        if (mounted) {
          setState(() {
            htmlContent = content;
          });
        }
      }).catchError((error) {
        debugPrint('Error loading HTML: $error');
      });
    } else {
      prepareLocalFiles();
    }
  }

  Future<void> prepareLocalFiles() async {
    try {
      final appDocDir = await getApplicationDocumentsDirectory();
      final assetsDir = Directory('${appDocDir.path}/webassets');

      if (!await assetsDir.exists()) {
        await assetsDir.create(recursive: true);
      }

      // Copy all necessary files
      await copyAssetToLocal(
          'assets/index.html', '${assetsDir.path}/index.html');
      await copyAssetToLocal(
          'assets/register.html', '${assetsDir.path}/register.html');
      await copyAssetToLocal('assets/style.css', '${assetsDir.path}/style.css');
      await copyAssetToLocal('assets/script.js', '${assetsDir.path}/script.js');

      if (mounted) {
        setState(() {
          localDirPath = assetsDir.path;
        });
      }
    } catch (e) {
      debugPrint('Error preparing local files: $e');
    }
  }

  Future<void> copyAssetToLocal(String assetPath, String localPath) async {
    final data = await rootBundle.load(assetPath);
    final bytes = data.buffer.asUint8List();
    await File(localPath).writeAsBytes(bytes);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Register App'),
      ),
      body: kIsWeb
          ? htmlContent != null
              ? SingleChildScrollView(
                  child: Html(
                    data: htmlContent!,
                    style: {
                      'body': Style(
                        margin: Margins.zero,
                        padding: HtmlPaddings.all(16),
                      ),
                    },
                  ),
                )
              : const Center(child: CircularProgressIndicator())
          : localDirPath != null
              ? InAppWebView(
                  key: webViewKey,
                  initialUrlRequest: URLRequest(
                    url: WebUri('file://$localDirPath/index.html'),
                  ),
                  initialOptions: InAppWebViewGroupOptions(
                    crossPlatform: InAppWebViewOptions(
                      javaScriptEnabled: true,
                      allowFileAccessFromFileURLs: true,
                      allowUniversalAccessFromFileURLs: true,
                    ),
                    android: AndroidInAppWebViewOptions(
                      useHybridComposition: true,
                      allowFileAccess: true,
                    ),
                  ),
                  onWebViewCreated: (controller) {
                    webViewController = controller;
                  },
                  onLoadStop: (controller, url) {
                    debugPrint('Navigated to: $url');
                  },
                )
              : const Center(child: CircularProgressIndicator()),
    );
  }
}
