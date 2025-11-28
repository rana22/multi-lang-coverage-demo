package com.example.demo;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GreetingServiceTest {

  private final GreetingService service = new GreetingService();

  @Test
  void greet_withName() {
    String result = service.greet("Alice");
    assertEquals("Hello, Alice!", result);
  }

  @Test
  void greet_withBlankName() {
    String result = service.greet("   ");
    assertEquals("Hello, world!", result);
  }

  @Test
  void greet_withNullName() {
    String result = service.greet(null);
    assertEquals("Hello, world!", result);
  }
}
