from django.urls import path
from . import views

app_name = 'base'

urlpatterns = [
  path('', views.MentalEase),
  path('room/', views.room),

  path('main/', views.main),
  
  path('get_token/', views.getToken),

  path('create_member/', views.createMember),
  path('get_member/', views.getMember),

   path('delete_member/', views.deleteMember),

]