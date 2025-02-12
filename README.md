# 2FA

# register :- localhost:5000/api/auth/register

        req body :- {
                        "fname": "Vasu",
                        "lname": "Gondaliya",
                        "email": "vasu3120@gmail.com",
                        "password": "Test@123"
                    }

# login :- localhost:5000/api/auth/login

        req body :- {
                        "email": "vasu3120@gmail.com",
                        "password": "Test@123"
                    }

# QR Code and secret key :- localhost:5000/api/auth/get-qr?email=vasu3120@gmail.com

# App verify :-localhost:5000/api/auth/verify-2FA-on-App

        req body :-   {
                         "code": "789088",
                         "secret": "NRBCCUKAKNUEG6SFKRUEAVCCPJDHOQRGKB4T6TBYENDV45CUMU7A"
                      }

# Email send otp :- localhost:5000/api/auth/send-2FA-on-email

# EMail verify :- localhost:5000/api/auth/verify-2FA-by-email

          req body :-  {
                            "otp":"169654"
                        }

# Home page :-localhost:5000/api/auth/homepage
