'use client'

import Modal from "@/app/components/modal/page";
import { config } from "@/app/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { Service } from "@/app/type";

const Page = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [remark, setRemark] = useState("");
    const [isShow, setIsShow] = useState(false);
    const [id, setId] = useState('');
    const [repairs, setRepairs] = useState<Service[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try{
            const res = await axios.get(config.apiUrl + "/service/list");
            setRepairs(res.data);
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการดึงข้อมูล",{autoClose: 2000});
            }else{
                toast.error("เกิดข้อผิดพลาดบางอย่าง",{autoClose: 2000});
            }
    }
    }

    const handleOpenModal = () => {
        setIsShow(true);
    }

    const handleCloseModal = () => {
        setIsShow(false);
    }

    const handleSave = async () => {
        try{
            const payload = {
                name:name,
                price:price,
                remarks:remark
            }

            let res;
            if(id == ''){
                res = await axios.post(config.apiUrl + "/service/create", payload);
                if(res.status === 201){
                    toast.success("บันทึกงานบริการเรียบร้อยแล้ว",{autoClose: 2000});
                    fetchData();
                    handleClearModal();
                    handleCloseModal();
                }
            }else{
                res = await axios.put(config.apiUrl + `/service/update/${id}`, payload);
                if(res.status === 200){
                    toast.success("แก้ไขงานบริการเรียบร้อยแล้ว",{autoClose: 2000});
                    setId('');
                    fetchData();
                    handleClearModal();
                    handleCloseModal();
                }
            }
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการบันทึกงานบริการ",{autoClose: 2000});
            }else{
                toast.error("เกิดข้อผิดพลาดบางอย่าง",{autoClose: 2000});
            }
        }
    }

    const handleClearModal = () => {
        setName("");
        setPrice(0);
        setRemark("");
    }

    const handleRemove = async (id: number) => {
        try{
            const button = await Swal.fire({
                title: 'ยืนยันการลบงานบริการ',
                text: "คุณต้องการลบงานบริการนี้ใช่หรือไม่?",
                icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#62adfc',
                    cancelButtonColor: '#f55d6a',
                    confirmButtonText: 'ยืนยัน',
                    cancelButtonText: 'ยกเลิก'
                });

            if (button.isConfirmed) {
                const res = await axios.delete(config.apiUrl + `/service/remove/${id}`);
                if(res.status === 200){
                    toast.success("ลบงานบริการเรียบร้อยแล้ว",{autoClose: 2000});
                    fetchData();
                }
            }
                  
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการลบงานบริการ",{autoClose: 2000});
            }else{
                toast.error("เกิดข้อผิดพลาดบางอย่าง",{autoClose: 2000});
            }
        }
    }

    const handleEdit = async (id: number) => {
       const repair = repairs.find((item: Service) => item.id === id);

         if(repair){
            setId(repair.id.toString());
            setName(repair.name);
            setPrice(repair.price);
            setRemark(repair.remarks || "");
            setIsShow(true);
            handleOpenModal();
         }
    }


    return (
        <div className="space-y-4">
            <h1 className="content-header">งานบริการ</h1>
            <div>
                <button className="button-plus" onClick={() => {handleOpenModal(); handleClearModal();}}>
                    <i className="fa fa-plus me-2"></i>บันทึกงานบริการ
                </button>
            </div>

              <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="text-left">ชื่องานบริการ</th>
                                <th className="text-right">ราคา</th>
                                <th className="text-left">หมายเหตุ</th>
                                <th className="text-left">วันที่บันทึก</th>
                                <th className="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {repairs.length > 0 ? (
                                repairs.map((item: Service) => (
                                <tr key={item.id}>
                                        <td>
                                            {item.name}
                                        </td>
                                        <td className="text-right">
                                            {item.price.toLocaleString("th-TH")}
                                        </td>
                                        <td>
                                            {item.remarks}
                                        </td>
                                        <td>
                                            {dayjs(item.payDate).format("DD/MM/YYYY")}
                                        </td>
                                        <td >
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
           
           <Modal open={isShow} onClose={handleCloseModal} title="บันทึกงานบริการ" modalSize="max-w-lg">
            <div className="space-y-4">
                <div>
                    <label>ชื่องานบริการ</label>
                    <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label>ราคา</label>
                    <input
                    type="text"
                    className="input"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    />
                </div>

                <div>
                    <label>หมายเหตุ</label>
                    <textarea
                    className="input"
                    rows={4}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-end gap-1">
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
        </div>
    )
}


export default Page;