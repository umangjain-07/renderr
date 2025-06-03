// lib/services/auth_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  final storage = FlutterSecureStorage();
  final String baseUrl = 'http://your-flask-backend/api/auth';

  Future<bool> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      body: jsonEncode({'email': email, 'password': password}),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await storage.write(key: 'token', value: data['access_token']);
      await storage.write(key: 'role', value: data['role']);
      return true;
    }
    return false;
  }

  Future<String?> getToken() async {
    return await storage.read(key: 'token');
  }

  Future<String?> getRole() async {
    return await storage.read(key: 'role');
  }

  Future<void> logout() async {
    await storage.delete(key: 'token');
    await storage.delete(key: 'role');
  }
}