// lib/screens/role_selection.dart
import 'package:flutter/material.dart';

class RoleSelectionScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Select Your Role')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/register/client'),
              child: Text('Register as Client'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/register/admin'),
              child: Text('Register as Admin'),
            ),
          ],
        ),
      ),
    );
  }
}

// Entry point to run this file directly
void main() {
  runApp(MaterialApp(
    debugShowCheckedModeBanner: false,
    home: RoleSelectionScreen(),
    routes: {
      '/register/client': (context) => Scaffold(
            appBar: AppBar(title: Text('Client Registration')),
            body: Center(child: Text('Client Registration Page')),
          ),
      '/register/admin': (context) => Scaffold(
            appBar: AppBar(title: Text('Admin Registration')),
            body: Center(child: Text('Admin Registration Page')),
          ),
    },
  ));
}
