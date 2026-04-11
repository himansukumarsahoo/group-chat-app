package com.chat.chat_app_backend.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

	@GetMapping("/health")
	public Map<String, String> statusCheck(){
		return Map.of("Status","UP");
	}
}
