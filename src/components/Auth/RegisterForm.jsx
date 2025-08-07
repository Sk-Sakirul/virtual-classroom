import React from "react";
import { Link } from "react-router-dom";

const RegisterForm = ({
  email,
  password,
  role,
  setEmail,
  setPassword,
  setRole,
  handleSubmit,
}) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-80 rounded-lg shadow h-auto p-6 bg-white relative overflow-hidden">
        <div className="flex flex-col justify-center items-center space-y-2">
          <h2 className="text-2xl font-medium text-slate-700">Register</h2>
          <p className="text-slate-500">Create a new account below.</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full mt-4 space-y-3">
          <input
            className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select
            className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <button
            className="w-full justify-center py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md text-white ring-2"
            type="submit"
          >
            Register
          </button>
          <p className="flex justify-center space-x-1">
            <span className="text-slate-700">Already have an account?</span>
            <Link className="text-blue-500 hover:underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
