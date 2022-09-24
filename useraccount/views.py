from django.shortcuts import render

# Create your views here.
from re import U
from django.shortcuts import render,redirect
from django.contrib.auth.models import auth
from django.contrib import messages
# from .models import userLogin
from django.contrib.auth import get_user_model
User = get_user_model()
# Create your views here.
def logout(request):
    auth.logout(request)
    return redirect('login');

def login(request):
    if request.method=='POST':
        email=request.POST['email']
        password=request.POST['password']
        user=auth.authenticate(email=email,password=password)
        if user is not None:
            auth.login(request,user)
            return redirect('home')
        else:
            messages.info(request,'Invalid Credentials')
            return redirect('login')
    else:
        return render(request,'index.html')


def register(request):
    if request.method=='POST':
        email=request.POST['email']
        username=request.POST['username']
        password=request.POST['passw']
        confirm_password=request.POST['pass2']
        if password==confirm_password:
            if User.objects.filter(username=username).exists():
                messages.info(request,'Username taken')
                return redirect('register')
            elif User.objects.filter(email=email).exists():
                messages.info(request,'Email address registered')
                return redirect('register')
            else:
                user=User.objects.create_user(password=password,email=email,username=username)
                user.save();
                print("user created");   
        else:
            messages.info(request,"Passwords doesn' match")
            print("Password doesn't match")
            return redirect('register')
        user=auth.authenticate(email=email,password=password)
        auth.login(request,user)
        return redirect('home');
    else:
        print("Don't match ")
        return render(request,'register.html')