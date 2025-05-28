from flask import Blueprint, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

chatbot_bp = Blueprint('chatbot', __name__)

class MovieChatbotAI:
    def __init__(self):
        self.api_key = os.getenv('GROQ_API_KEY')
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.conversation_history = [
            {
                "role": "system", 
                "content": "Bạn là trợ lý AI chuyên về phim ảnh của trang web Movie Recommender. Hãy trả lời thân thiện, hữu ích về các câu hỏi liên quan đến phim, diễn viên, đạo diễn, thể loại phim. Trả lời bằng tiếng Việt."
            }
        ]
    
    def get_response(self, message, user_id=1):
        try:
            # Thêm tin nhắn người dùng vào lịch sử
            self.conversation_history.append({
                "role": "user", 
                "content": message
            })
            
            # Gọi Groq API
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "llama3-8b-8192",  # Model miễn phí của Groq
                "messages": self.conversation_history,
                "max_tokens": 300,
                "temperature": 0.7
            }
            
            response = requests.post(self.base_url, json=payload, headers=headers, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                ai_response = data['choices'][0]['message']['content']
                
                # Thêm phản hồi AI vào lịch sử
                self.conversation_history.append({
                    "role": "assistant", 
                    "content": ai_response
                })
                
                # Giữ lịch sử hội thoại trong giới hạn (10 tin nhắn gần nhất)
                if len(self.conversation_history) > 11:  # 1 system + 10 messages
                    self.conversation_history = [self.conversation_history[0]] + self.conversation_history[-10:]
                
                # Kiểm tra xem có phải yêu cầu gợi ý phim không
                movie_keywords = ['gợi ý', 'recommend', 'phim', 'movie', 'film', 'xem', 'hay']
                is_movie_request = any(keyword in message.lower() for keyword in movie_keywords)
                
                if is_movie_request:
                    return {
                        'ai_response': ai_response,
                        'type': 'movie_recommendation',
                        'recommended_movies': self.extract_movies_from_response(ai_response)
                    }
                else:
                    return {
                        'ai_response': ai_response,
                        'type': 'general'
                    }
            elif response.status_code == 429:
                return {
                    'ai_response': 'Tôi đang bận quá. Vui lòng thử lại sau vài giây.',
                    'type': 'error'
                }
            elif response.status_code == 401:
                return {
                    'ai_response': 'Lỗi xác thực API. Vui lòng kiểm tra GROQ_API_KEY.',
                    'type': 'error'
                }
            else:
                return {
                    'ai_response': f'Lỗi API: {response.status_code} - {response.text}',
                    'type': 'error'
                }
                
        except requests.exceptions.Timeout:
            return {
                'ai_response': 'Yêu cầu quá lâu. Vui lòng thử lại.',
                'type': 'error'
            }
        except requests.exceptions.ConnectionError:
            return {
                'ai_response': 'Không thể kết nối đến AI service. Vui lòng kiểm tra internet.',
                'type': 'error'
            }
        except Exception as e:
            return {
                'ai_response': f'Xin lỗi, tôi gặp lỗi: {str(e)}',
                'type': 'error'
            }
    
    def extract_movies_from_response(self, response):
        """Trích xuất tên phim từ phản hồi AI"""
        movies = []
        lines = response.split('\n')
        
        for line in lines:
            # Tìm các dòng có số thứ tự hoặc dấu gạch ngang
            if any(marker in line for marker in ['1.', '2.', '3.', '4.', '5.', '-', '•']):
                # Loại bỏ số thứ tự và ký tự đặc biệt
                movie = line.strip()
                for marker in ['1.', '2.', '3.', '4.', '5.', '-', '•', '*']:
                    movie = movie.replace(marker, '').strip()
                
                if movie and len(movie) > 3:  # Đảm bảo tên phim có ý nghĩa
                    movies.append(movie)
        
        return movies[:5]  # Chỉ lấy tối đa 5 phim

@chatbot_bp.route('/ai-chat', methods=['POST'])
def ai_chat():
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'Không có dữ liệu'}), 400
        
        message = data.get('message', '').strip()
        user_id = data.get('user_id', 1)
        
        if not message:
            return jsonify({'error': 'Tin nhắn không được để trống'}), 400
        
        # Kiểm tra độ dài tin nhắn
        if len(message) > 1000:
            return jsonify({'error': 'Tin nhắn quá dài'}), 400
        
        bot = MovieChatbotAI()
        response = bot.get_response(message, user_id)
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            'ai_response': f'Lỗi server: {str(e)}',
            'type': 'error'
        }), 500

@chatbot_bp.route('/health', methods=['GET'])
def health_check():
    """Kiểm tra trạng thái API"""
    try:
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            return jsonify({
                'status': 'unhealthy',
                'groq_connected': False,
                'error': 'GROQ_API_KEY not found in environment variables'
            }), 500
        
        # Test Groq connection với request đơn giản
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama3-8b-8192",
            "messages": [{"role": "user", "content": "Hi"}],
            "max_tokens": 5
        }
        
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions", 
            json=payload, 
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            return jsonify({
                'status': 'healthy',
                'groq_connected': True,
                'model': 'llama3-8b-8192',
                'test_response': data['choices'][0]['message']['content']
            })
        else:
            return jsonify({
                'status': 'unhealthy',
                'groq_connected': False,
                'error': f'HTTP {response.status_code}: {response.text}'
            }), response.status_code
            
    except requests.exceptions.Timeout:
        return jsonify({
            'status': 'unhealthy',
            'groq_connected': False,
            'error': 'Request timeout'
        }), 500
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'groq_connected': False,
            'error': str(e)
        }), 500