# nextjs-nestjs-buy-digital-ecommerce
A simple e-commerce app developed using NextJS 13 and NestJS.

I have a demo video of this project in this [link](https://www.youtube.com/watch?v=uPy_wX6NcwY)

# Technologies Used
* **NextJS**
* **NestJS**
* **React-Bootsrap**
* **MongoDB**

# Testing this project
You can clone this project and test it for yourself. However, you need to create *.env* file in *client/buy-digial* directory for frontend. For the backend, you need to create *config*
directory in *server* directory then create *default.json* in it.

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