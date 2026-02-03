'use client'

import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Page = () => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [taxCode, setTaxCode] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try{
            const res = await axios.get('http://localhost:3001/api/company/list');
            if(res.status === 200){
                setName(res.data.name);
                setAddress(res.data.address);
                setEmail(res.data.email);
                setPhone(res.data.phone);
                setTaxCode(res.data.taxCode);
            }
        }catch(error:unknown){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "An error occurred during fetching data", {autoClose:2000});
            }else{
                toast.error("เกิดข้อผิดพลาดบางอย่าง", {autoClose:2000});
            }
        }
    }

     const handleSave = async () => {
            try{
                const payload = {
                    name:name,
                    address:address,
                    email:email,
                    phone:phone,
                    taxCode:taxCode
                };

                const res = await axios.post('http://localhost:3001/api/company/create',payload);
                if(res.status === 201){
                    toast.success("บันทึกข้อมูลร้านสำเร็จ", {autoClose:2000});
                }

            }catch(error:unknown){
                if(axios.isAxiosError(error)){
                    toast.error(error.response?.data.message || "An error occurred during saving", {autoClose:2000});
                }else{
                    toast.error("เกิดข้อผิดพลาดบางอย่าง", {autoClose:2000});
                }
            }
        }
    return (

       
        <div>
            <h1 className="content-header">ข้อมูลร้าน</h1>

            <div className="space-y-2 py-4">
                <div>
                    <div className="font-light">ชื่อร้าน</div>
                    <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className="input w-full text-gray-900"
                    />
                </div>

                <div>
                    <div className="font-light">ที่อยู่</div>
                    <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    type="text"
                    className="input w-full text-gray-900"
                    />
                </div>
             
                <div>
                    <div className="font-light">อีเมล</div>
                    <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    className="input w-full text-gray-900"
                    />
                </div>

             
                <div>
                    <div className="font-light">เบอร์โทรศัพท์</div>
                    <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="text"
                    className="input w-full text-gray-900"
                    />
                </div>

             
               <div>
                     <div className="font-light">รหัสประจำตัวผู้เสียภาษี</div>
                    <input
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    type="text"
                    className="input w-full text-gray-900"
                    />
               </div>

               <div className="pt-2">
                <button onClick={handleSave} className="button-save"><i className="fa fa-save mr-2"></i>บันทึก</button>
               </div>
            </div>
        </div>
    )
}

export default Page;