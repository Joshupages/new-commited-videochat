from .views import *
from django.urls import path,include,re_path
#from django_email_verification import urls as mail_urls
from allauth.account.views import LoginView
 
# except ImportError:

mail_urls = []

#from .import views
app_name = 'accounts'

urlpatterns = [

    path('' , login_attempt , name="login"),
    path('register/' ,register, name="register"),
    path('otp/' , otp , name="otp"),
    path('login-otp/', login_otp , name="login_otp"),
    path('login/',LoginView.as_view(), name='accounts_login'),  
    #path('base', base , name='base.html')
    #path('email/', include('mail_urls')),
    #path('verify/', include('django_email_verification.urls')),
    #re_path('^send email/$', ('sendEmail'))
]