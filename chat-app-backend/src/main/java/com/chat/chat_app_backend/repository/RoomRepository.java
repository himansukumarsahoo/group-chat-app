package com.chat.chat_app_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.chat.chat_app_backend.entity.Room;

public interface RoomRepository extends MongoRepository<Room, String> {
	// get room using roomid
	
	Room findByRoomId(String roomId);
}
