import React, { useState } from "react";

const LoginForm = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill all the fields.");
      return;
    }
    onSubmit({ email, password });
    setEmail("");
    setPassword("");
  };

  return (
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
      <button
        className="w-full justify-center py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md text-white ring-2"
        type="submit"
        disabled={loading}
      >
        Login
      </button>

      <p className="flex justify-center space-x-1">
        <span className="text-slate-700">Have an account?</span>
        <a className="text-blue-500 hover:underline" href="/register">
          Sign Up
        </a>
      </p>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </form>
  );
};

export default LoginForm;
