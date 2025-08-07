import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/Auth/RegisterForm";
import { registerUser } from "../features/auth/authThunks";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !role) {
      return alert("Please fill all the fields.");
    }

    const result = await dispatch(registerUser({ email, password, role }));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/login");
    }

    setEmail("");
    setPassword("");
    setRole("");
  };

  return (
    <RegisterForm
      email={email}
      password={password}
      role={role}
      setEmail={setEmail}
      setPassword={setPassword}
      setRole={setRole}
      handleSubmit={handleSubmit}
    />
  );
};

export default Register;
