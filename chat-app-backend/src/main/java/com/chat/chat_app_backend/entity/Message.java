package com.chat.chat_app_backend.entity;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Message {
	private String sender;
	private String content;
	private Instant timestamp;
	
	public Message(String sender, String content) {
		this.timestamp=Instant.now();
		this.sender = sender;
		this.content = content;
	}
	
	
}
