"use client";

import { config } from "@/app/config";
import axios from "axios";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Page = () => {
  const [data, setData] = useState<any[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalRepairs, setTotalRepairs] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [listYears, setListYears] = useState<any[]>([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const prevYear = new Date().getFullYear() - 5;
    const years = Array.from({ length: 6 }, (_, i) => prevYear + i);
    setListYears(years);
  
    fetchData();
    renderChart();
  }, []);

  const fetchData = async () => {
    try{
      const res = await axios.get(config.apiUrl + '/sale/dashboard/'+currentYear);
      setTotalIncome(res.data.income);
      setTotalRepairs(res.data.repairsCount);
      setTotalSales(res.data.salesCount);
    }catch(error: unknown){
      if(axios.isAxiosError(error)){
        toast.error(error.response?.data.message || "เกิดข้อผิดพลาดในการดึงข้อมูล",{autoClose: 2000});
      }else{
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล",{autoClose: 2000});
      }
    }
  }

  const renderChart = () => {
    const months = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    const data = months.map((month, index) => ({
      name: month,
      income: Math.floor(Math.random() * 10000),
    }));

    setData(data);
  };

  const box = (
    color: string,
    title: string,
    value: string,
    icon: React.ReactNode,
  ) => {
    return (
      <div
        className={`flex gap-4 items-center justify-between w-full ${color} py-8 px-10 rounded-xl border-r-8`}
      >
        <div className="text-3xl">{icon}</div>
        <div className="space-y-3">
          <div className="text-sm">{title}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </div>
    );
  };
  return (
    <div className="">
      <div>
        <h1 className="content-header">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4 py-3">
       <div>เลือกปี</div> 
       <select 
        className="border rounded-md px-4"
        value={currentYear}
        onChange={(e) => {
          setCurrentYear(parseInt(e.target.value));
        }}
       >
        {listYears.map((year) => (
          <option 
            key={year}
            value={year}
          >
            {year}
          </option>
        ))}
       </select>
       <button onClick={()=>{
        fetchData();
        renderChart();}} className="bg-purple-400 text-white px-4 py-2 rounded-md ml-4 hover:bg-purple-500 cursor-pointer">
        <i className="fa-solid fa-sync me-2"></i>แสดงรายงาน
       </button>
      </div>
      <div className="flex gap-4 py-6">
        {box(
          "bg-white shadow-xl text-blue-800",
          "ยอดขายทั้งหมด",
          totalIncome.toLocaleString()+"บาท",
          <div className="bg-linear-to-r bg-blue-200 p-4 rounded-full">
            <i className="fa-solid fa-chart-line"></i>
          </div>,
        )}
        {box(
          "bg-white shadow-xl text-purple-800",
          "งานรับซ่อม",
          totalRepairs.toLocaleString()+"งาน",
          <div className="bg-linear-to-r from-purple-200 via-purple-300 to-purple-300 p-4 rounded-full">
            <i className="fa-solid fa-wrench"></i>
          </div>,
        )}
        {box(
          "bg-white shadow-xl text-orange-800",
          "รายการขาย",
          totalSales.toLocaleString()+"รายการ",
          <div className="bg-linear-to-r from-orange-200 via-orange-300 to-orange-300 p-4 rounded-full">
            <i className="fa-solid fa-cart-shopping"></i>
          </div>,
        )}
      </div>
      <div className="border-l-3 border-purple-500 mb-6 mt-10 pl-2 text-xl ">รายได้แต่ละเดือน</div>
      <div style={{ width: "95%", height: 400 }} className="relative -z-10">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              wrapperStyle={{ zIndex: 10 }}
              formatter={(value) => {
                if (typeof value !== "number") return "";
                return `รายได้ ${value.toLocaleString("th-TH")} บาท`;
              }}
            />
            <Legend />
            <Bar dataKey="income" fill="#7a13e8" opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Page;

