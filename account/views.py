from re import U
from django.shortcuts import render,redirect
from django.contrib.auth.models import User,auth
from django.contrib.auth.hashers import make_password, check_password
from django.contrib import messages
from .models import userdetails
from .models import userLogin
from activitytracker.encrypt_util import *

# Create your views here.
def logout(request):
    auth.logout(request)
    return redirect('/');

def login(request):
    if request.method=='POST':
        username=request.POST['username']
        password=request.POST['password']
        print(username)
        # user=auth.authenticate(username=username,password=password)
        if username is not None:
            detailsone=userdetails()
            print(detailsone.email);
            u = userdetails.objects.get(email=username)
            print(u.passw)
            decryptpass= decrypt(u.passw)
            # checkpassword=check_password(password, decryptpass)
            # print("Verified:",checkpassword)    
            print (decryptpass)
            # print(password)
        else:
            messages.info(request,'Invalid Credentials')
            return redirect('login')
        return redirect('home')
    
    else:
        return render(request,'login.html')


def register(request):
    if request.method=='POST':
        email=request.POST['email']
        passw=request.POST['passw']
        pass2=request.POST['pass2']
        if passw==pass2:
            print('Original Password:', passw)
            encryptpass= encrypt(passw)
            print('Encrypted Password:',encryptpass)
            decryptpass= decrypt(encryptpass)
            print('Decrypted Password:',decryptpass)
            user=userdetails(email=email,passw=encryptpass)
            # User.objects.create_user(email=email,password=passw)
            user.save();
            print("user created");
                
        else:
            messages.info(request,'Passwords do not match')
            print("Password doesn't match")
            return redirect('register')
        
        return redirect('home');
    else:
        print("Don't match ")
        return render(request,'register.html')