package com.miproyecto.proyecto.chats.chatBot.mapper;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.miproyecto.proyecto.chats.chatBot.dto.ChatBotDTO;
import com.miproyecto.proyecto.chats.chatBot.dto.CreateChatBotDTO;
import com.miproyecto.proyecto.chats.chatBot.model.ChatBot;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.FIELD)
public interface ChatBotMapper {

    ChatBotMapper INSTANCE = Mappers.getMapper(ChatBotMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    ChatBot CreateChatBotToChatbot(CreateChatBotDTO createChatBotDTO);
    
    ChatBotDTO ChatBotToChatbotDTO(ChatBot chatBot);
    
}
