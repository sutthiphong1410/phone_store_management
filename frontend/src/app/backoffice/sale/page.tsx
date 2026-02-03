'use client'

import { config } from "@/app/config";
import { Sale } from "@/app/type";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const Page = () => {
    const [serial, setSerial] = useState('');
    const [price, setPrice] = useState(0);
    const [sales, setSales] = useState([]);
    const [id, setId] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const router = useRouter();

    const handleSave = async () => {
        try{
            const payload = {
                serial:serial,
                price:price
            }

            await axios.post(config.apiUrl+'/sale/create', payload);
            handleClear();
            fetchData();

        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "ไม่พบรายการสินค้า", {autoClose:2000});
            }else{
                toast.error("เกิดข้อผิดพลาดบางอย่าง", {autoClose:2000});
            }

        }
    }

    const handleRemove = async (id:number) => {
        try{
            const button = await Swal.fire({
                title: 'ยืนยันการลบข้อมูล?',
                text: "คุณต้องการลบข้อมูลนี้หรือไม่?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#62adfc', 
                cancelButtonColor: '#f55d6a',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก'
            });

            if(button.isConfirmed){
                await axios.delete(config.apiUrl+`/sale/remove/${id}`);
                fetchData();
                toast.success("ลบข้อมูลสำเร็จ", {autoClose:2000});
            }
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "An error occurred during removing", {autoClose:2000});
            }else{
                toast.error("เกิดข้อผิดพลาดบางอย่าง", {autoClose:2000});
            }
        }
    }

    const handleConfirm = async () => {
        try{
            const button = await Swal.fire({
                title: 'ยืนยันการขายสินค้า',
                text: "คุณต้องการยืนยันการขายสินค้านี้หรือไม่?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#62adfc',
                cancelButtonColor: '#f55d6a',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก'
            });

            if(button.isConfirmed){
                await axios.get(config.apiUrl+`/sale/confirm`);
                fetchData();
            }

        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "An error occurred during confirming", {autoClose:2000});
            }else{
                toast.error("เกิดข้อผิดพลาดบางอย่าง", {autoClose:2000});
            }
        }
    }

    const fetchData = async () => {
        try{
            const res = await axios.get(config.apiUrl+'/sale/list');
            setSales(res.data);

            let total = 0;
            for(let i =0; i < res.data.length; i++){
                total += res.data[i].price;
            }
            setTotalAmount(total);
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "An error occurred during fetching data", {autoClose:2000});
            }else{
                toast.error("เกิดข้อผิดพลาดบางอย่าง", {autoClose:2000});
            }
        }
    }

    const handleClear = () => {
        setSerial('');
        setPrice(0);
        setId(0);
    }

    useEffect(() => {
        fetchData();
    }, []);
    
    return (
        <div className="space-y-4">
            <div className="content-header flex justify-between py-2">ขายสินค้า 
                <button className="btn-history" onClick={() => router.push('/backoffice/sale/history')}><i className="fa fa-clock"></i> ประวัติการขาย</button>
                </div>
            
             <div className="flex h-12 gap-2">
                <div className="w-9/12">
                     <input type="text" className="input" placeholder="serial" value={serial} onChange={e=>setSerial(e.target.value)}/>
                </div>
               <div className="w-3/12">
                     <input type="text" className="input" placeholder="price" value={price} onChange={e=>setPrice(Number(e.target.value))}/>
               </div>
                <div>
                    <button className="flex items-center gap-2 bg-green-200 text-green-600 px-8 py-2 rounded-3xl
                            hover:bg-green-300 font-light
                            hover:scale-105
                            transition-all duration-300
                            focus:ring-2 focus:ring-green-100 focus:ring-offset-2
                            active:scale-95
                            cursor-pointer"
                            onClick={handleSave}>
                                <i className="fa fa-save"></i>บันทึก
                    </button>
                </div>
            </div>
            <div>
                <table className="table">
                        <thead>
                        <tr>
                            <th className="text-left">serial</th>
                            <th className="text-left">รายการสินค้า</th>
                            <th className="text-right">ราคา</th>
                            <th className="text-center"></th>
                        </tr>
                        </thead>

                        <tbody>
                        {sales.length > 0 ? (
                            sales.map((item: Sale) => (
                            <tr key={item.id}>
                                <td>
                                    {item.product.serial}
                                </td>
                                <td>
                                    {item.product.name}
                                </td>
                                <td className="text-right">
                                    {item.price.toLocaleString("th-TH")}
                                </td>
                                
                                <td >
                                <div className="flex justify-center gap-2">
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

           {sales.length > 0 && (
            <>
               <div className="flex justify-between items-center px-4">
                    <div>ยอดรวมทั้งหมด</div>
                    <div className="text-xl px-4 py-2 bg-gray-300 rounded-2xl font-bold">{totalAmount.toLocaleString("th-TH")} บาท</div>
                </div>

                <div className="flex justify-center items-center">
                    <button className="button-plus" onClick={handleConfirm}>
                        <i className="fa fa-check me-2"></i>
                        ยืนยันการขายสินค้า
                    </button>
                </div>            
            </>
           )}
           
        </div>
    )
}

export default Page;

//slide 231
