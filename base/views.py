from django.shortcuts import render
from django.http import JsonResponse
import random
import time
from agora_token_builder import RtcTokenBuilder
from base.models import RoomMember
import json
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def message(request):
    return render(request, 'base/message.html')

def start_point_messages(request):
    return render(request, 'base/start_point_messages.html')

def MentalEase(request):
    return render(request, 'base/MentalEase.html')

def room(request):
    return render(request, 'base/room.html')

def main(request):
    return render(request, 'main/main.html')


def getToken(request):
    appId = 'f13e857a200c4199a8de0064e3531c74'
    appCertificate = '36e4423234ba4ff290d534039d387252'
    channelName = request.GET.get('channel')
    uid = random.randint(1, 230)
    expirationTimeInSeconds = 3600
    currentTimeStamp = int(time.time())
    privilegeExpiredTs = currentTimeStamp + expirationTimeInSeconds
    role = 1

    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)

    return JsonResponse({'token': token, 'uid': uid}, safe=False)


@csrf_exempt
def createMember(request):
    data = json.loads(request.body)
    member, created = RoomMember.objects.get_or_create(
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name']
    )

    return JsonResponse({'name':data['name']}, safe=False)


def getMember(request):
    uid = request.GET.get('UID')
    room_name = request.GET.get('room_name')

    member = RoomMember.objects.get(
        uid=uid,
        room_name=room_name,
    )
    name = member.name
    return JsonResponse({'name':member.name}, safe=False)

"""@csrf_exempt
def deleteMember(request):
    data = json.loads(request.body)
    member = RoomMember.objects.get(
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name']
    )
    member.delete()

    return JsonResponse('Member deleted', safe=False)"""

@csrf_exempt
def deleteMember(request):
    try:
        data = json.loads(request.body)
        required_fields = ['name', 'UID', 'room_name']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'{field} is required.'}, status=400)

        try:
            member = RoomMember.objects.get(
                name=data['name'],
                uid=data['UID'],
                room_name=data['room_name']
            )
            member.delete()
            return JsonResponse({'message': 'Member deleted successfully.'}, safe=False)
        except RoomMember.DoesNotExist:
            return JsonResponse({'error': 'Member not found.'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON input.'}, status=400)
