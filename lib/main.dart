import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

import 'screens/client_login.dart';
import 'screens/admin_login.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) { 
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
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
      rootBundle
          .loadString('assets/index.html')
          .then((content) {
            if (mounted) {
              setState(() {
                htmlContent = content;
              });
            }
          })
          .catchError((error) {
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

      final assetFiles = ['index.html', 'style.css', 'script.js'];

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

  void navigateToClientLogin() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const ClientLoginScreen()),
    );
  }

  void navigateToAdminLogin() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const AdminLoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Chatbox app')),
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
                      onLinkTap: (url, attributes, element) {
                        if (url == null) return;
                        if (url.contains('client')) {
                          navigateToClientLogin();
                        } else if (url.contains('admin')) {
                          navigateToAdminLogin();
                        }
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

                controller.addJavaScriptHandler(
                  handlerName: 'navigateToClient',
                  callback: (args) {
                    navigateToClientLogin();
                  },
                );
                controller.addJavaScriptHandler(
                  handlerName: 'navigateToAdmin',
                  callback: (args) {
                    navigateToAdminLogin();
                  },
                );
              },
              shouldOverrideUrlLoading: (controller, navigationAction) async {
                final url = navigationAction.request.url.toString();
                if (url.contains('client')) {
                  navigateToClientLogin();
                  return NavigationActionPolicy.CANCEL;
                } else if (url.contains('admin')) {
                  navigateToAdminLogin();
                  return NavigationActionPolicy.CANCEL;
                }
                return NavigationActionPolicy.ALLOW;
              },
            )
          : const Center(child: CircularProgressIndicator()),
    );
  }
}
