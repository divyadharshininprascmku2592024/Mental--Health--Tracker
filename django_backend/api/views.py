from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

from .db import MongoCollectionHelper
from .serializers import (
    MoodSerializer,
    JournalSerializer,
    SleepSerializer,
    ActivitySerializer
)

mood_db = MongoCollectionHelper('moods')
journal_db = MongoCollectionHelper('journals')
sleep_db = MongoCollectionHelper('sleep')
activity_db = MongoCollectionHelper('activities')

# Health Check View
class HealthCheckView(APIView):
    def get(self, request):
        return Response({
            'status': 'online',
            'service': 'Django REST Framework Mental Health Backend',
            'timestamp': datetime.now().isoformat()
        })

# --- MOOD VIEWS ---
class MoodListCreateView(APIView):
    def get(self, request):
        data = mood_db.find_all()
        return Response(data)

    def post(self, request):
        serializer = MoodSerializer(data=request.data)
        if serializer.is_valid():
            now_iso = datetime.utcnow().isoformat() + 'Z'
            payload = serializer.validated_data
            payload['createdAt'] = now_iso
            payload['updatedAt'] = now_iso
            res = mood_db.insert_one(payload)
            return Response(res, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MoodDetailView(APIView):
    def get(self, request, pk):
        item = mood_db.find_by_id(pk)
        if not item:
            return Response({'message': 'Mood record not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(item)

    def put(self, request, pk):
        item = mood_db.find_by_id(pk)
        if not item:
            return Response({'message': 'Mood record not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = MoodSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            payload = serializer.validated_data
            payload['updatedAt'] = datetime.utcnow().isoformat() + 'Z'
            updated = mood_db.update_one(pk, payload)
            return Response(updated)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        success = mood_db.delete_one(pk)
        if success:
            return Response({'message': 'Mood record deleted successfully'})
        return Response({'message': 'Mood record not found'}, status=status.HTTP_404_NOT_FOUND)

# --- JOURNAL VIEWS ---
class JournalListCreateView(APIView):
    def get(self, request):
        data = journal_db.find_all()
        return Response(data)

    def post(self, request):
        serializer = JournalSerializer(data=request.data)
        if serializer.is_valid():
            now_iso = datetime.utcnow().isoformat() + 'Z'
            payload = serializer.validated_data
            payload['createdAt'] = now_iso
            payload['updatedAt'] = now_iso
            res = journal_db.insert_one(payload)
            return Response(res, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JournalDetailView(APIView):
    def get(self, request, pk):
        item = journal_db.find_by_id(pk)
        if not item:
            return Response({'message': 'Journal entry not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(item)

    def put(self, request, pk):
        item = journal_db.find_by_id(pk)
        if not item:
            return Response({'message': 'Journal entry not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = JournalSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            payload = serializer.validated_data
            payload['updatedAt'] = datetime.utcnow().isoformat() + 'Z'
            updated = journal_db.update_one(pk, payload)
            return Response(updated)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        success = journal_db.delete_one(pk)
        if success:
            return Response({'message': 'Journal entry deleted successfully'})
        return Response({'message': 'Journal entry not found'}, status=status.HTTP_404_NOT_FOUND)

# --- SLEEP VIEWS ---
class SleepListCreateView(APIView):
    def get(self, request):
        data = sleep_db.find_all()
        return Response(data)

    def post(self, request):
        serializer = SleepSerializer(data=request.data)
        if serializer.is_valid():
            now_iso = datetime.utcnow().isoformat() + 'Z'
            payload = serializer.validated_data
            payload['createdAt'] = now_iso
            payload['updatedAt'] = now_iso
            res = sleep_db.insert_one(payload)
            return Response(res, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SleepDetailView(APIView):
    def get(self, request, pk):
        item = sleep_db.find_by_id(pk)
        if not item:
            return Response({'message': 'Sleep record not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(item)

    def put(self, request, pk):
        item = sleep_db.find_by_id(pk)
        if not item:
            return Response({'message': 'Sleep record not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SleepSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            payload = serializer.validated_data
            payload['updatedAt'] = datetime.utcnow().isoformat() + 'Z'
            updated = sleep_db.update_one(pk, payload)
            return Response(updated)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        success = sleep_db.delete_one(pk)
        if success:
            return Response({'message': 'Sleep record deleted successfully'})
        return Response({'message': 'Sleep record not found'}, status=status.HTTP_404_NOT_FOUND)

# --- ACTIVITY VIEWS ---
class ActivityListCreateView(APIView):
    def get(self, request):
        data = activity_db.find_all()
        return Response(data)

    def post(self, request):
        serializer = ActivitySerializer(data=request.data)
        if serializer.is_valid():
            now_iso = datetime.utcnow().isoformat() + 'Z'
            payload = serializer.validated_data
            payload['createdAt'] = now_iso
            payload['updatedAt'] = now_iso
            res = activity_db.insert_one(payload)
            return Response(res, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ActivityDetailView(APIView):
    def get(self, request, pk):
        item = activity_db.find_by_id(pk)
        if not item:
            return Response({'message': 'Activity record not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(item)

    def put(self, request, pk):
        item = activity_db.find_by_id(pk)
        if not item:
            return Response({'message': 'Activity record not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ActivitySerializer(data=request.data, partial=True)
        if serializer.is_valid():
            payload = serializer.validated_data
            payload['updatedAt'] = datetime.utcnow().isoformat() + 'Z'
            updated = activity_db.update_one(pk, payload)
            return Response(updated)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        success = activity_db.delete_one(pk)
        if success:
            return Response({'message': 'Activity record deleted successfully'})
        return Response({'message': 'Activity record not found'}, status=status.HTTP_404_NOT_FOUND)
