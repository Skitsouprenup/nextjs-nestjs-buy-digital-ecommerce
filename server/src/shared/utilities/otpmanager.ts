export const generateOtp = () => {
  const otp = Math.floor(Math.random() * 900000) + 100000;
  const otpExpireTime = new Date();
  otpExpireTime.setMinutes(otpExpireTime.getMinutes() + 5);

  return { otp, otpExpireTime };
};
