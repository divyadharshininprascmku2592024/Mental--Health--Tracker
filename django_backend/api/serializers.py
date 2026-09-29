from rest_framework import serializers

class MoodSerializer(serializers.Serializer):
    _id = serializers.CharField(read_only=True)
    date = serializers.CharField(required=True)
    mood = serializers.ChoiceField(choices=['Very Happy', 'Happy', 'Neutral', 'Sad', 'Very Sad'], required=True)
    moodRating = serializers.IntegerField(min_value=1, max_value=10, required=True)
    stressLevel = serializers.IntegerField(min_value=1, max_value=10, required=True)
    anxietyLevel = serializers.IntegerField(min_value=1, max_value=10, required=True)
    note = serializers.CharField(required=False, allow_blank=True, default='')

class JournalSerializer(serializers.Serializer):
    _id = serializers.CharField(read_only=True)
    date = serializers.CharField(required=True)
    title = serializers.CharField(required=True, max_length=255)
    content = serializers.CharField(required=True)
    mood = serializers.CharField(required=True)

class SleepSerializer(serializers.Serializer):
    _id = serializers.CharField(read_only=True)
    date = serializers.CharField(required=True)
    sleepTime = serializers.CharField(required=True)
    wakeTime = serializers.CharField(required=True)
    totalHours = serializers.FloatField(min_value=0, max_value=24, required=True)
    quality = serializers.ChoiceField(choices=['Poor', 'Average', 'Good', 'Excellent'], required=True)

class ActivitySerializer(serializers.Serializer):
    _id = serializers.CharField(read_only=True)
    date = serializers.CharField(required=True)
    activityName = serializers.CharField(required=True, max_length=255)
    category = serializers.ChoiceField(
        choices=['Exercise', 'Meditation', 'Walking', 'Reading', 'Yoga', 'Hobby', 'Other'],
        required=True
    )
    duration = serializers.IntegerField(min_value=1, required=True)
    description = serializers.CharField(required=False, allow_blank=True, default='')
