# nextjs-nestjs-buy-digital-ecommerce
A simple e-commerce app developed using NextJS 13 and NestJS. Functionalities of this
project:

* Sends OTP via email for account activation and resetting password.
* Create and edit account.
* Add, delete and edit software products.
* Shopping Cart
* Add, delete and edit license tiers.
* Add, delete and edit software licenses.
* Purchase product via stripe.
* View orders.

I have a quick demo of this project in this [link](https://youtu.be/3UOMZMOupIw)

# Technologies Used
* **NextJS**
* **NestJS**
* **React-Bootsrap**
* **MongoDB**
* **Stripe**

# Testing this project
You can clone this project and test it for yourself. However, you need to create *.env* file in *client/buy-digial* directory for frontend. For the backend, you need to create *config*
directory in *server* directory then create *default.json* in it.

## Sample default.json for backend

{  
  "port": "4000",  
  "mongodbUri": "mongodb-uri",  
  "adminRoleSecretKey": "some-alphanumeric",  
  "adminEmail": "`example@email.com`",  
  "adminEmailPassword": "password",  
  "jwtSecret": "some-alphanumeric",  
  "domain":"front-end-domain",  
  "routesPrefix": "api/v1",  
  "productImageStoragePath": "../uploads",  
  "cloudinary": {  
    "apiKey": "look-at-cloudinary-dashboard",  
    "apiSecret": "look-at-cloudinary-dashboard",  
    "cloudName": "look-at-cloudinary-dashboard",  
    "folderPath": "buydigital/products",  
    "generatedProductPublicIdPrefix": "bd_product_",  
    "imageSizeBig": "1280x720",  
    "imageSizeSmall": "640x480"  
  },  
  "stripe": {  
    "publicKey": "look-at-stripe-dashboard",  
    "secretKey": "look-at-stripe-dashboard",  
    "webhookSecret": "look-at-stripe-event-forwarding-for-dev",  
    "successUrl": "`http://localhost:3000/order/success`",  
    "cancelledUrl": "`http://localhost:3000/order/cancel`"  
  }
}

## sample .env for frontend

NEXT_PUBLIC_API_BASE_URL=`http://localhost:4000/api/v1`
