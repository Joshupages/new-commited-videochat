from django.urls import path
from . import views

urlpatterns = [
  path('', views.MentalEase),
  path('room/', views.room),
  path('main/', views.main),
  path('message/', views.message),
   path('start_point_messages/', views.start_point_messages),

  path('get_token/', views.getToken),

  path('create_member/', views.createMember),
  path('get_member/', views.getMember),

   path('delete_member/', views.deleteMember),

]