import requests
import pandas as pd
import time
import socket
import urllib3.util.connection as urllib3_cn

# 👉 Ép requests chỉ dùng IPv4 (tránh lỗi timeout do IPv6)
def allowed_gai_family():
    return socket.AF_INET
urllib3_cn.allowed_gai_family = allowed_gai_family

API_KEY = 'd08553e5f7f124c69278f9dc85155da8'
BASE_URL = 'https://api.themoviedb.org/3'

def get_total_pages():
    url = f'{BASE_URL}/movie/popular'
    params = {
        'api_key': API_KEY,
        'language': 'en-US',
        'page': 1
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        total_pages = data.get('total_pages', 1)
        print(f'📄 Tổng số trang: {total_pages}')
        return total_pages
    except requests.exceptions.RequestException as e:
        print(f'❌ Lỗi khi gọi API để lấy total_pages: {e}')
        return 1

if __name__ == '__main__':
    get_total_pages()