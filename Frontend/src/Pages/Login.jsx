import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";

function Login() {
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
        <h1 className="text-4xl font-bold text-center mb-4">Login</h1>

        <div>
          <label className="block text-lg mb-1">Username</label>
          <input
            type="text"
            className="w-full rounded-xl p-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
          />
        </div>

        <div>
          <label className="block text-lg mb-1">Email</label>
          <input
            type="email"
            className="w-full rounded-xl p-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
          />
        </div>

        <div>
          <label className="block text-lg mb-1">Password</label>
          <input
            type="password"
            className="w-full rounded-xl p-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
          />
        </div>

        <button className="bg-[#CDB4DB] hover:bg-[#B79DCE] w-full h-12 rounded-xl font-semibold transition cursor-pointer">
          Submit
        </button>

        <p className="text-sm text-center">
          Don’t have an account?
          <Link to="/signup" className="ml-1 underline text-[#FAF3F0] hover:text-white cursor-pointer">
            Sign up now
          </Link>
        </p>

        <div className="flex items-center justify-center">
          <button
            onClick={login}
            type="button"
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl shadow hover:bg-gray-100 transition cursor-pointer"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Sign in with Google</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
