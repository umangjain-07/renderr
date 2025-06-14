import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

class Clients extends StatefulWidget {
  const Clients({super.key});

  @override
  State<Clients> createState() => _ClientsState();
}

class _ClientsState extends State<Clients> {
  String? htmlContent;
  final GlobalKey webViewKey = GlobalKey();
  InAppWebViewController? webViewController;
  String? localDirPath;

  @override
  void initState() {
    super.initState();
    if (kIsWeb) {
      rootBundle.loadString('assets/clients.html').then((content) {
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

      // List of all asset files for client registration
      final assetFiles = [
        'clients.html',
        'clients.css',
        'clients.js',
      ];

      for (final file in assetFiles) {
        await copyAssetToLocal('assets/$file', '${assetsDir.path}/$file');
      }

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
        title: const Text('Clients'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: kIsWeb
          ? htmlContent != null
              ? SingleChildScrollView(
                  child: Html(
                    data: htmlContent!,
                    style: {
                      'body': Style(
                        margin: Margins.zero,
                        padding: HtmlPaddings.all(0),
                      ),
                      '*': Style(
                        margin: Margins.zero,
                        padding: HtmlPaddings.zero,
                      ),
                    },
                  ),
                )
              : const Center(child: CircularProgressIndicator())
          : localDirPath != null
              ? InAppWebView(
                  key: webViewKey,
                  initialUrlRequest: URLRequest(
                    url: WebUri('file://$localDirPath/clients.html'),
                  ),
                  initialOptions: InAppWebViewGroupOptions(
                    crossPlatform: InAppWebViewOptions(
                      javaScriptEnabled: true,
                      allowFileAccessFromFileURLs: true,
                      allowUniversalAccessFromFileURLs: true,
                      useShouldOverrideUrlLoading: true,
                      mediaPlaybackRequiresUserGesture: false,
                      supportZoom: false,
                    ),
                    android: AndroidInAppWebViewOptions(
                      useHybridComposition: true,
                      allowFileAccess: true,
                      domStorageEnabled: true,
                    ),
                    ios: IOSInAppWebViewOptions(
                      allowsInlineMediaPlayback: true,
                    ),
                  ),
                  onWebViewCreated: (controller) {
                    webViewController = controller;
                  },
                  onLoadStop: (controller, url) {
                    debugPrint('Client Registration loaded: $url');
                  },
                  shouldOverrideUrlLoading:
                      (controller, navigationAction) async {
                    final uri = navigationAction.request.url!;

                    // Handle navigation back to role selection
                    if (uri.toString().contains('back') ||
                        uri.toString().contains('role-selection')) {
                      Navigator.pop(context);
                      return NavigationActionPolicy.CANCEL;
                    }

                    return NavigationActionPolicy.ALLOW;
                  },
                )
              : const Center(child: CircularProgressIndicator()),
    );
  }
}

// void main() {
//   runApp(
//     const MaterialApp(
//       debugShowCheckedModeBanner: false,
//       home: Clients(),
//     ),
//   );
// }
