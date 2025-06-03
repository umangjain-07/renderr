// lib/screens/admin_dashboard.dart
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../services/auth_service.dart';

class AdminDashboardScreen extends StatefulWidget {
  @override
  _AdminDashboardScreenState createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  List<dynamic> clients = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchClients();
  }

  Future<void> _fetchClients() async {
    final token = await AuthService().getToken();

    final response = await http.get(
      Uri.parse('http://your-flask-backend/api/admin/clients'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      setState(() {
        clients = jsonDecode(response.body);
        isLoading = false;
      });
    } else {
      // Handle error
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Admin Dashboard')),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: clients.length,
              itemBuilder: (context, index) {
                final client = clients[index];
                return ListTile(
                  title: Text(client['name']),
                  subtitle: Text(client['schoolName']),
                  trailing: Text(client['email']),
                  onTap: () {
                    // Navigate to client details
                  },
                );
              },
            ),
    );
  }
}

// 👇 Entry point for running this file directly
void main() {
  runApp(MaterialApp(
    debugShowCheckedModeBanner: false,
    home: AdminDashboardScreen(),
  ));
}
