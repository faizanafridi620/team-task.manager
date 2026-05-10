import { api } from "../services/api";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const { setUser } = useAuth();
  const [isLogin, setIslogin] = useState(true);
  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await api.post("/auth/login", {
          email: formdata.email,
          password: formdata.password,
        });
        const token = res.data.token;

        localStorage.setItem("token", token);

        const decoded = jwtDecode(token);
        setUser(decoded);
        alert("Login Successful");
        navigate("/dashboard");
      } else {
        await api.post("/auth/signup", formdata);

        alert("Signup successful Now login");
        setIslogin(true);

        setFormData({
          name: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-indigo-600">
          Task Manager
        </h1>

        <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
          {isLogin ? "Welcome Back" : "Create Your Account"}
        </p>

        {!isLogin ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer text-sm sm:text-base"
            >
              Signup
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer text-sm sm:text-base"
            >
              Login
            </button>
          </form>
        )}

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <span
            onClick={() => setIslogin(!isLogin)}
            className="text-indigo-600 cursor-pointer ml-1 font-medium hover:underline"
          >
            {isLogin ? "Signup" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
