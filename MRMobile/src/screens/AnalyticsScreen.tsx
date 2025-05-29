
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import tw from 'twrnc';
import { getAnalytics } from '../utils/api';
import { API_URL } from '@env';

const AnalyticsScreen: React.FC = () => {
  const [analytics, setAnalytics] = useState<{
    genre_distribution?: string;
    rating_distribution?: string;
    correlation_matrix?: string;
  }>({});

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await getAnalytics();
      console.log(data);
      
      setAnalytics(data);
    } catch (error) {
      console.error('Lỗi tải dữ liệu phân tích:', error);
    }
  };

  return (
    <ScrollView style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Phân Tích Dữ Liệu</Text>
      {analytics.genre_distribution && (
        <View style={tw`mb-4`}>
          <Text style={tw`text-lg font-bold`}>Phân Bố Thể Loại</Text>
          <Image
            source={{ uri: `${API_URL}${analytics.genre_distribution}` }}
            style={tw`w-full h-64`}
            resizeMode="contain"
          />
        </View>
      )}
      {analytics.rating_distribution && (
        <View style={tw`mb-4`}>
          <Text style={tw`text-lg font-bold`}>Phân Bố Điểm Đánh Giá</Text>
          <Image
            source={{ uri: `${API_URL}${analytics.rating_distribution}` }}
            style={tw`w-full h-64`}
            resizeMode="contain"
          />
        </View>
      )}
      {analytics.correlation_matrix && (
        <View style={tw`mb-4`}>
          <Text style={tw`text-lg font-bold`}>Ma Trận Tương Quan</Text>
          <Image
            source={{ uri: `${API_URL}${analytics.correlation_matrix}` }}
            style={tw`w-full h-64`}
            resizeMode="contain"
          />
        </View>
      )}
    </ScrollView>
  );
};

export default AnalyticsScreen;
