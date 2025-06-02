import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String _baseUrl =
      'http://10.0.2.2:5000'; // Replace with your IP if on device

  static Future<http.Response> registerUser(
      Map<String, dynamic> formData) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(formData),
    );
    return response;
  }

  static Future<http.Response> sendMessage(String message) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/chat'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'message': message}),
    );
    return response;
  }
}
