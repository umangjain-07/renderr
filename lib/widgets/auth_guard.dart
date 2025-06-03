// lib/widgets/auth_guard.dart
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/auth_service.dart';

class AuthGuard extends StatelessWidget {
  final Widget child;
  final String requiredRole;

  AuthGuard({required this.child, required this.requiredRole});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: AuthService().getRole(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return CircularProgressIndicator();
        }

        final userRole = snapshot.data;
        
        if (userRole == null) {
          // No token, redirect to login
          WidgetsBinding.instance.addPostFrameCallback((_) {
            Navigator.pushReplacementNamed(context, '/login');
          });
          return Container();
        } else if (userRole != requiredRole) {
          // Wrong role, redirect to their dashboard
          WidgetsBinding.instance.addPostFrameCallback((_) {
            Navigator.pushReplacementNamed(context, '/${userRole}/dashboard');
          });
          return Container();
        } else {
          return child;
        }
      },
    );
  }
}