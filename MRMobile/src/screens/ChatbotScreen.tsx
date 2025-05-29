
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import tw from 'twrnc';
import { chatWithAI } from '../utils/api';
import { ChatbotResponse } from '../types';
import { useAuth } from '../context/AuthContext';

const ChatbotScreen: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const { user } = useAuth();

  const handleSend = async () => {
    if (!user || !input) return;
    try {
      const userMessage = { role: 'user' as const, content: input };
      setMessages([...messages, userMessage]);
      setInput('');
      const response: ChatbotResponse = await chatWithAI(input, user.id);
      const assistantMessage = { role: 'assistant' as const, content: response.ai_response };
      setMessages((prev) => [...prev, assistantMessage]);
      if (response.type === 'movie_recommendation' && response.recommended_movies) {
        const moviesMessage = {
          role: 'assistant' as const,
          content: `Gợi ý phim: ${response.recommended_movies.join(', ')}`,
        };
        setMessages((prev) => [...prev, moviesMessage]);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể trò chuyện với chatbot');
    }
  };

  const renderMessage = ({ item }: { item: { role: 'user' | 'assistant'; content: string } }) => (
    <View
      style={tw`p-2 mb-2 rounded ${
        item.role === 'user' ? 'bg-blue-100 ml-10' : 'bg-gray-100 mr-10'
      }`}
    >
      <Text>{item.role === 'user' ? 'Bạn: ' : 'AI: '}{item.content}</Text>
    </View>
  );

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Trò Chuyện Với Chatbot</Text>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
      />
      <View style={tw`flex-row mt-4`}>
        <TextInput
          style={tw`flex-1 border border-gray-300 p-2 rounded mr-2`}
          placeholder="Nhập tin nhắn..."
          value={input}
          onChangeText={setInput}
        />
        <Button title="Gửi" onPress={handleSend} />
      </View>
    </View>
  );
};

export default ChatbotScreen;
