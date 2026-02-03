'use client'

import Modal from "@/app/components/modal/page";
import { config } from "@/app/config";
import { User } from "@/app/type";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Page = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isShow, setIsShow] = useState(false);
    const [id, setId] = useState(0);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [level, setLevel] = useState("");
    const [levelList, setLevelList] = useState(["admin", "user"]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try{
            const res = await axios.get(config.apiUrl + "/user/list");
            setUsers(res.data);
        }catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",{autoClose: 2000});
            }else {
                toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",{autoClose: 2000});
            }    
        }
    }

    const handleSave = async () => {
        try{
            if(password !== confirmPassword){
                toast.error("รหัสผ่านไม่ตรงกัน", {autoClose:2000});
                return;
            }

            const payload = {
                name:name,
                username:username,
                password:password,
                level:level
            }

            let res;
            if(id === 0){
                res = await axios.post(config.apiUrl+'/user/create', payload);
                if(res.data.status === 200){
                    toast.success("บันทึกข้อมูลสำเร็จ", {autoClose:2000});
                    handleCloseModal();
                    fetchData();
                }
            }else{
                res = await axios.put(config.apiUrl+`/user/update/${id}`, payload);
                if(res.data.status === 200){
                    toast.success("อัพเดทข้อมูลสำเร็จ", {autoClose:2000});
                    setId(0);
                    handleCloseModal();
                    fetchData();
                }
            }
           
            
        }catch(error: unknown){
            if(axios.isAxiosError(error)) {
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดบางอย่างระหว่างการบันทึก", {autoClose:2000});
            }else {
                toast.error("เกิดข้อผิดพลาดบางอย่าง", {autoClose:2000});
            }
        }
    }

    const handleEdit = (id:number) => {
        const user = users.find((item:User) => item.id === id);
        if(user){
            setId(user.id);
            setName(user.name);
            setUsername(user.username);
            setLevel(user.level);
            handleOpenModal();
        }
    }

    const handleRemove = async (id:number) => {
        try{
            const button = await Swal.fire({
                title: 'ยืนยันการลบข้อมูล?',
                text: "คุณต้องการลบข้อมูลนี้ใช่หรือไม่?",
                icon: 'warning',
                showCancelButton: true,
               confirmButtonColor: '#62adfc', 
                cancelButtonColor: '#f55d6a',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก'
            });

            if (button.isConfirmed) {
                const res = await axios.delete(config.apiUrl+`/user/remove/${id}`);
                if(res.data.status === 200){
                    toast.success("ลบข้อมูลสำเร็จ", {autoClose:2000});
                    fetchData();
                }
            }
        }catch(error: unknown){
            if(axios.isAxiosError(error)) {
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดบางอย่างระหว่างการลบ", {autoClose:2000});
            }else {
                toast.error("เกิดข้อผิดพลาดบางอย่าง", {autoClose:2000});
            }
        }
    }

    const handleOpenModal = () => {
        setIsShow(true);
    }

    const handleCloseModal = () => {
        setIsShow(false);
    }
    return (
        <div className="space-y-4">
            <h1 className="content-header">ผู้ใช้งาน</h1>
            <div>
                <button className="button-plus" onClick={handleOpenModal}><i className="fa fa-plus me-2"></i>เพิ่มผู้ใช้งาน</button>
            </div>

              <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="text-left">ชื่อผู้ใช้งาน</th>
                                <th className="text-left">username</th>
                                <th className="text-left">level</th>
                                <th className="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                        {users.length > 0 ? (
                            users.map((item: User) => (
                            <tr key={item.id}>
                                <td>
                                    {item.name}
                                </td>
                                <td>
                                    {item.username}
                                </td>
                                <td className="text-left">
                                    {item.level}
                                </td>
                                <td>
                                    <div className="flex justify-center gap-2">
                                        <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(item.id)}
                                        >
                                        <i className="fa-solid fa-pencil"></i>
                                        </button>
                                        <button
                                        className="btn-delete"
                                        onClick={(e) => handleRemove(item.id)}
                                        >
                                        <i className="fa-regular fa-trash-can"></i>
                                        </button>
                                    </div>
                                        </td>
                            </tr>
                                ))
                                ) : (
                                    <tr>
                                    <td colSpan={9} className="py-6 text-center text-zinc-500">
                                        ไม่มีข้อมูล
                                    </td>
                                    </tr>
                                )}
                        </tbody>
                </table>
            </div>
            <Modal  open={isShow} onClose={handleCloseModal} title="เพิ่มผู้ใช้งาน" modalSize="max-w-lg">
                <div className="space-y-4">
                    <div>
                        <label className="label">ชื่อผู้ใช้งาน</label>
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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label">password</label>
                        <input
                        type="password"
                        className="input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label">confirm password</label>
                        <input
                        type="password"
                        className="input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label">level</label>
                        <select
                        className="input"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        >
                        <option value="">-- เลือกระดับผู้ใช้งาน --</option>
                        {levelList.map((item:string) => (
                            <option key={item} value={item}>
                            {item}
                            </option>
                        ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-1 justify-end">
                        <button className="button-remove" onClick={handleCloseModal}>
                            <i className="fa fa-times me-2"></i>
                            ยกเลิก
                        </button>
                        <button className="button-save" onClick={() => {handleSave();}}>
                            <i className="fa fa-save me-2"></i>
                            บันทึก
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Page;