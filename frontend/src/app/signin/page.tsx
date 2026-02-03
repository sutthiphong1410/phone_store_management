"use client";

import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { config } from "../config";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSignIn = async () => {
    try{
        const payload = {
            username:username,
            password:password
        };
        const res = await axios.post(config.apiUrl+'/user/signin',payload);
        if(res.data.token !== null){
            localStorage.setItem("phoneStoreManage",res.data.token);
            toast.success("เข้าสู่ระบบสำเร็จ",{autoClose:2000})
           if(res.data.level === "admin"){
            router.push('/backoffice/dashboard');
           }else{
            router.push('/backoffice/sale');
           }
        }

    }catch(error:unknown){
        if(axios.isAxiosError(error)){
            toast.error(error.response?.data.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",{autoClose:2000})
        }else{
            toast.error("เกิดข้อผิดพลาดบางอย่าง",{autoClose:2000});
        }
    }
}

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-gray-100 via-yellow-100/50 to-yellow-200  flex flex-col justify-center items-center">
        <div className="bg-white/85 px-10 pt-18 pb-6 rounded-3xl justify-between items-center gap-10  relative">
        <div className="space-y-8 w-80">
         

          <div className="space-y-4">
            <div className="relative">
              <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                className="w-full pl-11 pr-4 py-2 rounded-3xl bg-gray-100/80 
                inset-shadow-md outline-none transition"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="relative">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="password"
                className="w-full pl-11 pr-4 py-2 rounded-3xl bg-gray-100/80 
                inset-shadow-md outline-none transition"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="text-center ">
             <p className="text-center text-gray-500 pb-4 pt-3">Sign In To Backoffice...</p>
            <button
              className="button "
              onClick={handleSignIn}
            >
              Sign In
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center absolute -top-18 left-1/2 transform -translate-x-1/2 ">
            <div className="p-6 py-8 bg-yellow-200 rounded-full">
                <i className="fa-solid fa-user text-6xl text-black"></i>
            </div>
           
         </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

