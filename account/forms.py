# from models import userdetails
from attr import fields
from django import forms
from .models import userdetails
class userdetailsForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = userdetails
        fields='__all__'