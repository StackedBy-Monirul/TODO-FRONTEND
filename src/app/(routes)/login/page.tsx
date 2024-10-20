"use client";
import React, { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { postAPI } from "../../components/Api";
import { useRouter } from "next/navigation";

const login = () => {
   const navigate = useRouter();
   const [email, setEmail] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const [error, setError] = useState<string>("");
   const cookie = new Cookies();
   const loginHandler = () => {
      postAPI("auth/login", null, {
         email: email,
         password: password,
      }).then((res) => {
         if (res.status === 200 || (res.data && res.data.status === 200)) {
            const token = res.data.token;
            const expire = new Date(Date.now() + 2 * 60 * 60 * 1000);
            const data: string = JSON.stringify({
               token: token,
               expire: expire,
            });
            cookie.set("todo-token", data, { path: "/", expires: expire });
            navigate.push("/");
         } else {
            setError(res.data && res.data.message);
         }
      });
   };
   useEffect(() => {
      const token = cookie.get("todo-token") || null;
      if (token) {
         const expirationDate = new Date(token.expire);
         const currentDate = new Date();
         if (expirationDate > currentDate) {
            navigate.push("/");
         }
      }
   });
   return (
      <div className="min-h-screen bg-[#080710] flex items-center justify-center overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[500px]">
            <div className="h-[200px] absolute w-[200px] rounded-[50%] bg-[linear-gradient(#1845ad,#23a2f6)] -top-[80px] -left-[80px]"></div>
            <div className="h-[200px] absolute w-[200px] rounded-[50%] bg-[linear-gradient(#ff512f,#f09819)] -bottom-[80px] -right-[80px]"></div>
         </div>
         <div className="px-5 backdrop-blur-[10px] relative bg-[rgba(255,255,255,0.13)] border-2 border-[rgba(255,255,255,0.1)] w-[400px] rounded-lg text-white shadow-[0_0_40px_rgba(8,7,16,0.6)]">
            <div>
               <h1 className="my-5 text-center">Login</h1>
               <p className="text-sm text-white">Email:</p>
               <input type="email" className="w-full bg-transparent border rounded px-2 py-1 mb-5" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
               <p className="text-sm text-white">Password:</p>
               <input type="password" className="w-full bg-transparent border rounded px-2 py-1 mb-5" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
               <p className="text-red-500 text-sm">{error}</p>
               <div className="text-center pt-2 pb-5">
                  <button className="px-10 py-2 bg-teal-400 text-white font-bold rounded" onClick={loginHandler}>
                     Log In
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default login;
