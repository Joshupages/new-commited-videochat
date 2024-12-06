from django.urls import path
from . import consumers


websocket_urlpatterns = [
    path('chat/', consumers.ChatConsumer.as_asgi()),
    #path('ws/some_path/', consumers.MyConsumer.as_asgi()),
 ]