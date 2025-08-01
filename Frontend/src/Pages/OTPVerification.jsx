import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";

function OTPVerification() {
  const login = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log("Google credential:", credentialResponse);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return (
    <div className="bg-[url('/stacked-steps-haikei.svg')] bg-cover bg-center min-h-screen flex items-center justify-center p-6">
      <form className="bg-[#8c49b4]/90 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 text-white">
        <h1 className="text-4xl font-bold text-center mb-4">OTP Verification</h1>

        <div>
          <label className="block text-lg mb-1">Please enter your OTP(One Time Password) here:</label>
          <input
            type="number"
            className="w-full rounded-xl p-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
            maxlength="6"
          />
        </div>

        <button className="bg-[#CDB4DB] hover:bg-[#B79DCE] w-full h-12 rounded-xl font-semibold transition cursor-pointer" 
        >
          Submit
        </button>

      </form>
    </div>
  );
}

export default OTPVerification;
