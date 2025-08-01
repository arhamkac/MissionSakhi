import { useState, useRef, } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Link,useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

function SignUp() {
  const formRef = useRef();
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const navigate=useNavigate();

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  const otp = generateOTP();

  const handleSendOTP = (e) => {
    e.preventDefault();

    const time = new Date().toLocaleTimeString();
    const templateParams = {
      to_name: username,
      email: userEmail,
      time: time,
      otp: otp,
    };

    emailjs
      .send(
        import.meta.env.VITE_SERVICE_ID_EJS,
        import.meta.env.VITE_TEMPLATE_ID_EJS,
        templateParams,
        import.meta.env.VITE_PUBLIC_KEY
      )
      .then((response) => {
        console.log("Email Sent :)", response.text);
        alert("OTP Sent to Email!");
      })
      .catch((error) => {
        console.log("Email Sending Failed", error);
        alert("Failed to send OTP");
      });
  };

  const login = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log("Google credential:", credentialResponse);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  const handleOTP=()=>{

  }

  return (
    <div className="bg-[url('/stacked-steps-haikei.svg')] bg-cover bg-center min-h-screen flex items-center justify-center p-6">
      <form
        ref={formRef}
        onSubmit={handleSendOTP}
        className="bg-[#8c49b4]/90 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 text-white"
      >
        <h1 className="text-4xl font-bold text-center">Sign Up</h1>

        <div>
          <label className="block text-lg mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl p-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
            required
          />
        </div>

        <div>
          <label className="block text-lg mb-1">Email</label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full rounded-xl p-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
            required
          />
        </div>

        <div>
          <label className="block text-lg mb-1">Password</label>
          <input
            type="password"
            className="w-full rounded-xl p-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#CDB4DB] hover:bg-[#B79DCE] w-full h-12 rounded-xl font-semibold transition"
        >
          Send OTP
        </button>

        <p className="text-sm text-center">
          Already have an account?
          <Link to="/login" className="ml-1 underline text-[#FAF3F0] hover:text-white">
            Log in
          </Link>
        </p>

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={login}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl shadow hover:bg-gray-100 transition"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Sign up with Google</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
