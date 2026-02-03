'use client'

import { config } from "@/app/config";
import axios from "axios";
import Link from "next/dist/client/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Modal from "../modal/page";

type SidebarProps = {
  onSelect?: () => void;
};

const Page = ({ onSelect }: SidebarProps) => {
    const [name, setName] = useState("");
    const [level, setLevel] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [usernamem , setUsernamem] = useState("");
    const [password , setPassword] = useState("");
    const [confirmPassword , setConfirmPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleOpenModal = () => {
        setIsOpen(true);
    }

    const handleCloseModal = () => {
        setIsOpen(false);
    }

    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem("phoneStoreManage");
            const res = await axios.get(config.apiUrl + "/user/info", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
                setName(res.data.name);
                setUsernamem(res.data.username);
                setLevel(res.data.level);   
        }catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",{autoClose: 2000});
            }else {
                toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",{autoClose: 2000});
            }
        }
    }

    const handleLogout = async () => {
      const button = await Swal.fire({
          title: 'ยืนยันการออกจากระบบ',
          text: "คุณต้องการออกจากระบบใช่หรือไม่?",
          icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#62adfc', 
            cancelButtonColor: '#f55d6a',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        });
        if (button.isConfirmed) {
            localStorage.removeItem("phoneStoreManage");
            router.push("/signin");
        }
    }  

    const handleSave = async () => {
        try{
            if(password !== confirmPassword){
                toast.error("รหัสผ่านไม่ตรงกัน",{autoClose:2000});
                return;
            }

            const payload = {
                name:name,
                username:usernamem,
                password:password,
                level:level
            };
            const token = localStorage.getItem("phoneStoreManage");
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const res = await axios.put(config.apiUrl+'/user/update',payload, { headers })
            if(res.status === 200){
                toast.success("บันทึกข้อมูลผู้ใช้สำเร็จ",{autoClose:2000});
                fetchUserInfo();
                handleCloseModal();
            }

        }catch(error:unknown){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "An error occurred during saving user info",{autoClose:2000});
            }else{
                toast.error("เกิดข้อผิดพลาดบางอย่าง",{autoClose:2000});
            }
        }
    }
    return (
        <>
        <div className="shadow-xl  h-full text-gray-600 overflow-y-auto">
            <div className="pt-8 flex flex-col items-center justify-center space-y-2">
                
                <div className="flex flex-col items-center text-sm">
                   <div className="flex items-center space-x-2">
                    <p className="text-lg">{name}</p>
                   </div>
                    <p className="font-light">(level : {level})</p>
                </div>
                
                <div className="space-x-1">
                    <button className="bg-blue-300 text-blue-500 rounded-full px-2 py-1 cursor-pointer hover:bg-blue-400 hover:text-white transition-all duration-300" onClick={handleOpenModal}>
                        <i className="fa-solid fa-user-pen"></i>
                    </button>

                    <button className="bg-red-300 text-red-500 rounded-full px-2 py-1 cursor-pointer hover:bg-red-400 hover:text-white transition-all duration-300" onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </button>
                </div>

            </div>
            <hr className="my-3 border-gray-200" />
            <div className="font-light">
                <ul>
                {level === "admin" && (
                  <>
                        <Link href="/backoffice/dashboard" onClick={onSelect}><li className="url-link"><i className="fa-solid fa-tachometer-alt"></i> Dashboard</li></Link>  
                        <Link href="/backoffice/buy" onClick={onSelect}><li className="url-link"><i className="fa fa-shopping-cart"></i> ซืั้อสินค้า</li></Link>
                  </>
                )}
                <Link href="/backoffice/sale" onClick={onSelect}><li className="url-link"><i className="fa fa-dollar-sign"></i> ขายสินค้า</li></Link>
                <Link href="/backoffice/repair" onClick={onSelect}><li className="url-link"><i className="fa fa-wrench"></i> รับซ่อม</li></Link>
                {level === "admin" && (
                    <>
                        <Link href="/backoffice/company" onClick={onSelect}><li className="url-link"><i className="fa fa-building"></i> ข้อมูลร้าน</li></Link>
                        <Link href="/backoffice/user" onClick={onSelect}><li className="url-link"><i className="fa-solid fa-users"></i> ผู้ใช้งาน</li></Link>
                    </>
                )}
                </ul>
            </div>
        </div>
        
        <Modal open={isOpen} onClose={handleCloseModal} title="แก้ไขข้อมูลผู้ใช้" modalSize="max-w-lg" >
            <div className="space-y-4">
                <div>
                    <label className="label">ชื่อ</label>
                    <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="label">username</label>
                    <input
                    type="text"
                    className="input"
                    value={usernamem}
                    onChange={(e) => setUsernamem(e.target.value)}
                    />
                </div>

                <div>
                    <label className="label">รหัสผ่าน</label>
                    <input
                    type="text"
                    className="input"
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div>
                    <label className="label">ยืนยันรหัสผ่าน</label>
                    <input
                    type="text"
                    className="input"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-1 justify-end">
                    <button className="button-remove" onClick={handleCloseModal}>
                        <i className="fa fa-times me-2"></i>
                        ยกเลิก
                    </button>
                    <button className="button-save" onClick={handleSave}>
                        <i className="fa fa-save me-2"></i>
                        บันทึก
                    </button>
                </div>
            </div>
        </Modal>
        </>
    )
}

export default Page;