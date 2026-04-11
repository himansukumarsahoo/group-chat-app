package com.chat.chat_app_backend.controller;

import java.time.Instant;


import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import com.chat.chat_app_backend.entity.Message;
import com.chat.chat_app_backend.entity.Room;
import com.chat.chat_app_backend.payload.MessageRequest;
import com.chat.chat_app_backend.repository.RoomRepository;

@Controller
@CrossOrigin("*")
public class ChatController {
	private RoomRepository roomRepository;

	public ChatController(RoomRepository roomRepository) {
		this.roomRepository = roomRepository;
	}
	@MessageMapping("/sendmessage/{roomId}")
	@SendTo("/topic/room/{roomId}")
	public Message sendMessage(@DestinationVariable String roomId,@RequestBody MessageRequest request) {
		Room room = roomRepository.findByRoomId(request.getRoomId());
		Message message = new Message();
		message.setContent(request.getContent());
		message.setSender(request.getSender());
		message.setTimestamp(Instant.now());
		
		if(room != null) {
			room.getMessages().add(message);
			roomRepository.save(room);
		}else {
			throw new RuntimeException("Room not found");
		}
		return message;
	}
	
}
