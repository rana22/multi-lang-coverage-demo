package com.example.demo;

import org.springframework.stereotype.Service;

@Service
public class GreetingService {

  public String greet(String name) {
    if (name == null || name.isBlank()) {
      return "Hello, world!";
    }
    return "Hello, " + name.trim() + "!";
  }
}
