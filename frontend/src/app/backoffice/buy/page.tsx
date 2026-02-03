'use client'

import { useEffect, useState } from "react";
import Modal from "@/app/components/modal/page";
import axios from "axios";
import { toast } from "react-toastify";
import { config } from "@/app/config";
import { Product } from "@/app/type";
import Swal from "sweetalert2";

const Page = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [serial, setSerial] = useState("");
    const [name, setName] = useState("");
    const [release, setRelease] = useState("");
    const [color, setColor] = useState("");
    const [price, setPrice] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [remarks, setRemarks] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [id, setId] = useState<number | null>(0);
    const [qty, setQty] = useState(1);

    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        try{
            const res = await axios.get(config.apiUrl + `/buy/list/${page}`);
            if(res.status === 200){
                setProducts(res.data.products);
                setTotalPage(res.data.totalPage);
                setTotalRows(res.data.totalRows);
            }
        }catch(error:unknown){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "An error occurred during fetching data", {autoClose:2000});
            }else{
                toast.error("เกิดข้อผิดพลาดบางอย่าง", {autoClose:2000});
            }
        }
    }

    const handleOpenModal = () => {
        setIsOpen(true);
    }

    const handleCloseModal = () => {
        setIsOpen(false);
    }

    const handleSave = async () => {
        try{
            const payload = {
                serial:serial,
                name:name,
                release:release,
                color:color,
                price:Number(price),
                qty:qty,
                customerName:customerName,
                customerPhone:customerPhone,
                customerAddress:customerAddress,
                remarks:remarks
            }
            if(id === 0){
                const res = await axios.post(config.apiUrl+'/buy/create',payload);
                if(res.status === 201){
                    toast.success("บันทึกรายการซื้อสำเร็จ", {autoClose:2000});
                    fetchData();
                    handleCloseModal();
                }
            }else{
                const res = await axios.put(`${config.apiUrl}/buy/update/${id}`,payload);
                if(res.status === 200){
                    toast.success("แก้ไขรายการซื้อสำเร็จ", {autoClose:2000});
                    fetchData();
                    setId(0);
                    handleCloseModal();
                }
            }
        
        }catch(error:unknown){
            if(axios.isAxiosError(error)){
               toast.error(error.response?.data.message || "An error occurred during saving", {autoClose:2000});
            }else{
                toast.error("เกิดข้อผิดพลาดบางอย่าง", {autoClose:2000});
            }
        }
    }

    const handleEdit = (id:number) => {
        const product = products.find((item:Product) => item.id === id);
        if(product !== undefined){
            setSerial(product.serial || "");
            setName(product.name);
            setRelease(product.release);
            setColor(product.color);
            setPrice(product.price.toString());
            setCustomerName(product.customerName);
            setCustomerPhone(product.customerPhone);
            setCustomerAddress(product.customerAddress || "");
            setRemarks(product.remarks || "");
            setId(id);
            handleOpenModal();
        }
    }

    const handleRemove = async (id:number) => {
        try{
            const button  = await Swal.fire({
                title: 'คุณแน่ใจหรือไม่?',
                text: "คุณต้องการลบรายการซื้อนี้หรือไม่?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#62adfc', 
                cancelButtonColor: '#f55d6a',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก'
            });

            if(button.isConfirmed){
                const res = await axios.delete(`${config.apiUrl}/buy/remove/${id}`);
                if(res.status === 200){
                    toast.success("ลบรายการซื้อสำเร็จ", {autoClose:2000});
                    fetchData();
                }
            }

        }catch(error:unknown){
            if(axios.isAxiosError(error)){
               toast.error(error.response?.data.message || "An error occurred during removing", {autoClose:2000});
            }else{
                toast.error("เกิดข้อผิดพลาดบางอย่าง", {autoClose:2000});
            }
        }
    }

    const exportToExcel = async () => {
        try{
            const payload = {
                products: products
            }
            const res = await axios.post(config.apiUrl + '/buy/export', payload);
            const fileName = res.data.fileName;
            const a = document.createElement('a');
            a.href = config.apiUrl + '/uploads/' + fileName;
            a.download = fileName;
            a.target = '_blank';
            a.click();
        }catch(error:unknown){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message || "An error occurred during exporting", {autoClose:2000});
            }else{
                toast.error("เกิดข้อผิดพลาดบางอย่าง", {autoClose:2000});
            }
        }
    }

    const handleClear = () => {
        setSerial("");
        setName("");
        setRelease("");
        setColor("");
        setPrice("");
        setCustomerName("");
        setCustomerPhone("");
        setCustomerAddress("");
        setRemarks("");
        setQty(1);
        setId(0);
    }
    
    return (
        <div className="space-y-4">
            <h1 className="content-header">รายการซื้อ</h1>
            <div className="space-x-2">
                <button onClick={() => {handleClear(); handleOpenModal();}} className="button-plus"><i className="fa fa-plus mr-1"></i>เพิ่มรายการ</button>
                <button onClick={exportToExcel} className="button-save"><i className="fa fa-file-excel mr-1"></i>ส่งออก Excel</button>
            </div>
            <div>
                <table className="table">
                    <thead>
                    <tr>
                        <th className="text-left">serial</th>
                        <th className="text-left">ชื่อสินค้า</th>
                        <th className="text-left">รุ่น</th>
                        <th className="text-left">สี</th>
                        <th className="text-right">ราคา</th>
                        <th className="text-left">ลูกค้า</th>
                        <th className="text-left">เบอร์โทร</th>
                        <th className="text-center">หมายเหตุ</th>
                        <th className="text-center"></th>
                    </tr>
                    </thead>

                    <tbody>
                    {products.length > 0 ? (
                        products.map((item: Product) => (
                        <tr key={item.id}>
                            <td>
                                {item.serial}
                            </td>
                            <td>
                                {item.name}
                            </td>
                            <td>
                                {item.release}
                            </td>
                            <td>
                                {item.color}
                            </td>
                            <td className="text-right">
                                {item.price.toLocaleString("th-TH")}
                            </td>
                            <td>
                                {item.customerName}
                            </td>
                            <td>
                                {item.customerPhone}
                            </td>
                            <td>
                                {item.remarks}
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

            <div className="mt-5 px-2">
                <hr className="py-2"/>
                <span className="text-sm text-zinc-500">
                    จำนวน {totalRows} รายการ | หน้า {page} / {totalPage} 
                </span>
                <div className="float-right flex items-center gap-2">
                    <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="btn-paginate"
                    >
                    <i className="fa fa-chevron-left" />
                    </button>
                    <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPage}
                    className="btn-paginate"
                    >
                    <i className="fa fa-chevron-right" />
                    </button>
                </div>
                

            </div>
            </div>
           <Modal open={isOpen} onClose={handleCloseModal} title="เพิ่มรายการซื้อ">
            <div className="space-y-6">

               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="label">Serial สินค้า</label>
                    <input
                    type="text"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    className="input"
                    />
                </div>

                <div>
                    <label className="label">ชื่อสินค้า</label>
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    />
                </div>

                <div>
                    <label className="label">รุ่น</label>
                    <input
                    type="text"
                    value={release}
                    onChange={(e) => setRelease(e.target.value)}
                    className="input"
                    />
                </div>

                <div>
                    <label className="label">สี</label>
                    <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="input"
                    />
                </div>

                <div>
                    <label className="label">ราคา</label>
                    <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="input w-full"
                    />
                </div>

                 <div>
                    <label className="label">จำนวนสินค้า</label>
                    <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value ?? 0))}
                    className="input w-full"
                    />
                </div>

                
                </div>
                

                <hr className="border-gray-200" />

            
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="label">ชื่อลูกค้า</label>
                    <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="input"
                    />
                </div>

                <div>
                    <label className="label">เบอร์โทร</label>
                    <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="input"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="label">ที่อยู่ลูกค้า</label>
                    <textarea
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="input "
                  
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="label">หมายเหตุ</label>
                    <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="input "
                  
                    />
                </div>
                </div>

             
                <div className="flex justify-end gap-1 ">
                <button onClick={handleCloseModal} className="button-remove flex items-center gap-2">
                    <i className="fa fa-times" />
                    ยกเลิก
                </button>
              
                <button onClick={handleSave} className="button-save flex items-center gap-2">
                    <i className="fa fa-save" />
                    บันทึก
                </button>
                </div>
            </div>
            </Modal>

        </div>
    )
}

export default Page;


