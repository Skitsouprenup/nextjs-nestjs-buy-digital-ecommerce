import config from 'config';
import nodemailer from 'nodemailer';

export const initEmailTransport = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.get('adminEmail'),
      pass: config.get('adminEmailPassword'),
    },
  });
};

export const createVerifyUserEmailTemplate = (otp: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head lang="en">
        <meta charset="utf-8">
      </head>

      <body>
        <h1>Buy Digital!</h1>
        <p>This is the otp you requested: <b>${otp}</b></p>
        <p>If you didn't request this, please ignore this email.</p>
      </body>
    </html>
  `;
};

export const createForgotPassEmailTemplate = (password: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head lang="en">
        <meta charset="utf-8">
      </head>

      <body>
        <h1>Buy Digital!</h1>
        <p>Your password has been reset. Here's your new password:
        <b>${password}</b></p>
        <br />
        <p>You can change this password in your profile.</p>
        <br />
        <p>login <a href="${config.get('domain')}">here</a>.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </body>
    </html>
  `;
};

export const createOrderSuccessTemplate = (
  orderId: string,
  updatedOrderId: string,
) => {
  const orderLink = config.get('stripe.successUrl') + updatedOrderId;

  return `
    <!DOCTYPE html>
    <html>
      <head lang="en">
        <meta charset="utf-8">
      </head>

      <body>
        <h1>Buy Digital!</h1>
        <p>The order <b>${orderId}</b> is now being processed.</p>
        <p>You may look at the order status in this link: <b>${orderLink}</b></p>
        <p>If you didn't request this, please ignore this email.</p>
      </body>
    </html>
  `;
};
