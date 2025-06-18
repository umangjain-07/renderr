import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';
// Import the new client registration screen
import 'client_registration.dart';
import 'clients.dart';

class ClientLoginScreen extends StatefulWidget {
  final String? selectedRole;

  const ClientLoginScreen({
    super.key,
    this.selectedRole,
  });

  @override
  State<ClientLoginScreen> createState() => _ClientLoginScreenState();
}

class _ClientLoginScreenState extends State<ClientLoginScreen> {
  String? htmlContent;
  final GlobalKey webViewKey = GlobalKey();
  InAppWebViewController? webViewController;
  String? localDirPath;
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    _initializeClientLogin();
  }

  Future<void> _initializeClientLogin() async {
    try {
      if (kIsWeb) {
        await _loadWebAssets();
      } else {
        await _prepareLocalFiles();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          errorMessage = 'Failed to load client login: $e';
          isLoading = false;
        });
      }
    }
  }

  Future<void> _loadWebAssets() async {
    try {
      final content = await rootBundle.loadString('assets/client_login.html');
      if (mounted) {
        setState(() {
          htmlContent = content;
          isLoading = false;
        });
      }
    } catch (error) {
      debugPrint('Error loading client login HTML: $error');
      if (mounted) {
        setState(() {
          errorMessage = 'Failed to load login page';
          isLoading = false;
        });
      }
    }
  }

  Future<void> _prepareLocalFiles() async {
    try {
      final appDocDir = await getApplicationDocumentsDirectory();
      final assetsDir = Directory('${appDocDir.path}/webassets');

      if (!await assetsDir.exists()) {
        await assetsDir.create(recursive: true);
      }

      // List of all asset files for client login
      final assetFiles = [
        'client_login.html',
        'client_login.css',
        'client_login.js',
      ];

      // Copy all assets concurrently
      final copyFutures = assetFiles.map((file) =>
          _copyAssetToLocal('assets/$file', '${assetsDir.path}/$file'));

      await Future.wait(copyFutures);

      if (mounted) {
        setState(() {
          localDirPath = assetsDir.path;
          isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Error preparing local files: $e');
      if (mounted) {
        setState(() {
          errorMessage = 'Failed to prepare login files: $e';
          isLoading = false;
        });
      }
    }
  }

  Future<void> _copyAssetToLocal(String assetPath, String localPath) async {
    try {
      final data = await rootBundle.load(assetPath);
      final bytes = data.buffer.asUint8List();
      await File(localPath).writeAsBytes(bytes);
    } catch (e) {
      debugPrint('Error copying asset $assetPath: $e');
      rethrow;
    }
  }

  // Navigate to client registration (signup)
  void _navigateToClientRegistration([Map<String, dynamic>? userData]) {
    try {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => ClientLoginScreen(
            selectedRole: widget.selectedRole,
          ),
        ),
      );
    } catch (e) {
      debugPrint('Navigation to registration error: $e');
      _showErrorSnackBar('Failed to navigate to registration');
    }
  }

  void _navigateToClients([Map<String, dynamic>? userData]) {
    if (!mounted) return;

    try {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => Clients(
              // Pass any user data if needed
              // userData: userData,
              ),
        ),
      );
    } catch (e) {
      debugPrint('Navigation to clients error: $e');
      _showErrorSnackBar('Failed to navigate to clients');
    }
  }

  // Handle successful login
  void _handleSuccessfulLogin(Map<String, dynamic> userData) {
    try {
      // You can navigate to dashboard or main app here
      _showSuccessSnackBar(
          'Login successful! Welcome ${userData['name'] ?? 'User'}');

      // For now, just show success message
      // In a real app, you'd navigate to the main dashboard
      Future.delayed(const Duration(seconds: 2), () {
        // Navigate to main app or dashboard
        debugPrint('Navigating to dashboard with user: $userData');
      });
    } catch (e) {
      debugPrint('Login success handling error: $e');
    }
  }

  // Handle back navigation
  void _handleBackNavigation() {
    try {
      Navigator.pop(context);
    } catch (e) {
      debugPrint('Back navigation error: $e');
    }
  }

  // Show error snackbar
  void _showErrorSnackBar(String message) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message),
          backgroundColor: Colors.red,
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  // Show success snackbar
  void _showSuccessSnackBar(String message) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message),
          backgroundColor: Colors.green,
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  Widget _buildErrorWidget() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.error_outline,
            size: 64,
            color: Colors.red,
          ),
          const SizedBox(height: 16),
          Text(
            'Failed to Load Login',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            errorMessage ?? 'Unknown error occurred',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Colors.grey[600],
                ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              setState(() {
                errorMessage = null;
                isLoading = true;
              });
              _initializeClientLogin();
            },
            child: const Text('Retry'),
          ),
        ],
      ),
    );
  }

  Widget _buildWebView() {
    return htmlContent != null
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
              onLinkTap: (url, attributes, element) {
                if (url != null) {
                  if (url.contains('signup') || url.contains('register')) {
                    _navigateToClientRegistration();
                  } else if (url.contains('back')) {
                    _handleBackNavigation();
                  }
                }
              },
            ),
          )
        : const Center(child: CircularProgressIndicator());
  }

  Widget _buildInAppWebView() {
    return localDirPath != null
        ? InAppWebView(
            key: webViewKey,
            initialUrlRequest: URLRequest(
              url: WebUri('file://$localDirPath/client_login.html'),
            ),
            initialOptions: InAppWebViewGroupOptions(
              crossPlatform: InAppWebViewOptions(
                javaScriptEnabled: true,
                allowFileAccessFromFileURLs: true,
                allowUniversalAccessFromFileURLs: true,
                useShouldOverrideUrlLoading: true,
                mediaPlaybackRequiresUserGesture: false,
                supportZoom: false,
                userAgent: 'Bidyut-Flutter-App',
              ),
              android: AndroidInAppWebViewOptions(
                useHybridComposition: true,
                allowFileAccess: true,
                domStorageEnabled: true,
                databaseEnabled: true,
              ),
              ios: IOSInAppWebViewOptions(
                allowsInlineMediaPlayback: true,
                enableViewportScale: true,
              ),
            ),
            onWebViewCreated: (controller) {
              webViewController = controller;

              // Add JavaScript handlers
              controller.addJavaScriptHandler(
                handlerName: 'navigateToClientRegistration',
                callback: (args) {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => const ClientRegistrationScreen()),
                  );
                },
              );

              controller.addJavaScriptHandler(
                handlerName: 'navigateToSignup',
                callback: (args) {
                  // Extract user data if provided
                  Map<String, dynamic>? userData;
                  if (args.isNotEmpty && args[0] is Map) {
                    userData = Map<String, dynamic>.from(args[0]);
                  }
                  _navigateToClientRegistration(userData);
                },
              );

              // Add this new handler for clients navigation
              controller.addJavaScriptHandler(
                handlerName: 'navigateToClients',
                callback: (args) {
                  _navigateToClients(args.isNotEmpty
                      ? Map<String, dynamic>.from(args[0])
                      : null);
                },
              );

              controller.addJavaScriptHandler(
                handlerName: 'loginSuccess',
                callback: (args) {
                  if (args.isNotEmpty && args[0] is Map) {
                    final userData = Map<String, dynamic>.from(args[0]);
                    _handleSuccessfulLogin(userData);
                  }
                },
              );

              controller.addJavaScriptHandler(
                handlerName: 'goBack',
                callback: (args) {
                  _handleBackNavigation();
                },
              );

              controller.addJavaScriptHandler(
                handlerName: 'showError',
                callback: (args) {
                  if (args.isNotEmpty && args[0] is String) {
                    _showErrorSnackBar(args[0]);
                  }
                },
              );

              controller.addJavaScriptHandler(
                handlerName: 'showSuccess',
                callback: (args) {
                  if (args.isNotEmpty && args[0] is String) {
                    _showSuccessSnackBar(args[0]);
                  }
                },
              );

              controller.addJavaScriptHandler(
                handlerName: 'logMessage',
                callback: (args) {
                  if (args.isNotEmpty) {
                    debugPrint('Client Login JS: ${args[0]}');
                  }
                },
              );

              // Inject selected role if available
              if (widget.selectedRole != null) {
                controller.evaluateJavascript(source: '''
                  window.selectedRole = "${widget.selectedRole}";
                  console.log("Selected role injected: ${widget.selectedRole}");
                ''');
              }
            },
            onLoadStart: (controller, url) {
              debugPrint('Client login started loading: $url');
            },
            onLoadStop: (controller, url) {
              debugPrint('Client login loaded: $url');

              // Inject any additional data after page loads
              if (widget.selectedRole != null) {
                controller.evaluateJavascript(source: '''
                  if (typeof window.updateSelectedRole === 'function') {
                    window.updateSelectedRole("${widget.selectedRole}");
                  }
                ''');
              }
            },
            onLoadError: (controller, url, code, message) {
              debugPrint('Client login load error: $message');
              if (mounted) {
                setState(() {
                  errorMessage = 'Failed to load login page: $message';
                  isLoading = false;
                });
              }
            },
            onConsoleMessage: (controller, consoleMessage) {
              debugPrint('Client Login Console: ${consoleMessage.message}');
            },
            shouldOverrideUrlLoading: (controller, navigationAction) async {
              final url = navigationAction.request.url.toString();

              // Handle navigation URLs
              if (url.contains('signup') || url.contains('register')) {
                _navigateToClientRegistration();
                return NavigationActionPolicy.CANCEL;
              }

              if (url.contains('back') || url.contains('role-selection')) {
                _handleBackNavigation();
                return NavigationActionPolicy.CANCEL;
              }

              // Allow other URLs
              return NavigationActionPolicy.ALLOW;
            },
          )
        : const Center(child: CircularProgressIndicator());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.selectedRole != null
            ? '${widget.selectedRole!.toUpperCase()} Login'
            : 'Client Login'),
        centerTitle: true,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: _handleBackNavigation,
        ),
        actions: [
          if (widget.selectedRole != null)
            Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: Center(
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Theme.of(context).primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: Theme.of(context).primaryColor.withOpacity(0.3),
                    ),
                  ),
                  child: Text(
                    widget.selectedRole!.toUpperCase(),
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
      body: errorMessage != null
          ? _buildErrorWidget()
          : isLoading
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CircularProgressIndicator(),
                      SizedBox(height: 16),
                      Text('Loading login page...'),
                    ],
                  ),
                )
              : kIsWeb
                  ? _buildWebView()
                  : _buildInAppWebView(),
    );
  }

  @override
  void dispose() {
    webViewController?.dispose();
    super.dispose();
  }
}

// void main() {
//   runApp(
//     MaterialApp(
//       debugShowCheckedModeBanner: false,
//       home: const ClientRegistrationScreen(
//         selectedRole: 'client',
//       ),
//     ),
//   );
// }
