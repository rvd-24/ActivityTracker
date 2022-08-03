from django import forms
from tabtracker.models import trackdetails

class ContactModelForm(forms.ModelForm):
    class Meta:
        model = trackdetails
        fields = '__all__'