'use client'

import { Sale } from "@/app/type";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { config } from "@/app/config";
import dayjs from "dayjs";

const Page = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try{
            const res = await axios.get(config.apiUrl+'/sale/history');
            setSales(res.data);
        }catch(error: unknown){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการดึงข้อมูล", {autoClose:2000});
            }else{
                toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล", {autoClose:2000});
            }
        }
    }
    return (
        <div>
            <h1 className="content-header">ประวัติการขาย</h1>
            <div className="py-2">
                <table className="table ">
                        <thead>
                        <tr>
                            <th className="text-left">วันที่</th>
                            <th className="text-left">รายการ</th>
                            <th className="text-right">ราคา</th>
                            <th className="text-center">พิมพ์บิล</th>
                        </tr>
                        </thead>

                        <tbody>
                        {sales.length > 0 ? (
                            sales.map((item: Sale) => (
                            <tr key={item.id}>
                                <td>
                                    {dayjs(item.payDate).format('DD/MM/YYYY')}
                                </td> 
                                <td>
                                    {item.product.name}
                                </td>
                                <td className="text-right">
                                    {item.price.toLocaleString("th-TH")}
                                </td>
                                
                                <td >
                                <div className="flex justify-center gap-2">
                                    <a
                                    target="_blank"
                                    className="button-plus"
                                    href={'/backoffice/sale/print?id='+item.id}
                                    >
                                    <i className="fa fa-print"></i>
                                    พิมพ์
                                    </a>
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
           
        </div>
    )
}

export default Page;