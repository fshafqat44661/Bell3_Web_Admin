import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Checkbox from "@/components/ui/Checkbox";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { handleLogin } from "./store";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();
const LoginForm = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });
  const router = useRouter();
  const onSubmit = async (data) => {
    setLoading(true);
    // Create a request body with email and password
    const requestBody = {
      email: data.email,
      password: data.password,
    };

    try {
      const serverHost = process.env.NEXT_PUBLIC_BELL3_API_URL
      // Send a POST request to your server's login endpoint
      const response = await fetch(`${serverHost}auth/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(requestBody),
      });

      // Parse the JSON response
      const {data} = await response.json();

      // Check if the request was successful
      if (response.ok) {
        // Dispatch the handleLogin action with the user data as payload
        dispatch(handleLogin(true));

        const token = data.token;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data.user));

        router.push("/analytics");

      } else {
        console.log(response);
        if(response.status == 401) {

          toast.error("Invalid credentials", {
            position: "bottom-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });


        }

      }
    } catch (error) {
      // Handle any errors that may occur during the login process
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const [checked, setChecked] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        name="email"
        label="email"
        defaultValue="demo2221@bell3.net"
        type="email"
        register={register}
        error={errors?.email}
      />
      <Textinput
        name="password"
        label="passwrod"
        type="password"
        defaultValue="Testtest1"
        register={register}
        error={errors.password}
      />

      <button className="btn btn-dark block w-full text-center" type="submit" disabled={loading}>
        {loading ? (
            <Loading/>
        ) : (
            "Sign in"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
