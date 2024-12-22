# from django.shortcuts import render
# from django.contrib.auth import get_user_model
# from django_email_verification import sendConfirm
# from django.views.decorators.csrf import csrf_exempt

# # Create your views here.
# @csrf_exempt
# def sendEmail(request):
#     password = request.POSt.get('password')
#     username = request.POST.get('username')
#     email = request.POST.get('email')
#     user = get_user_model().objects.create (username = username, password = password, email = email)
#     sendConfirm(user)
#     return render(request, 'confirm_template.html')