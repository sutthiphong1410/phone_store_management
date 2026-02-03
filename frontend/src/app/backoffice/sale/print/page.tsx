'use client'

import { config } from "@/app/config";
import { Sale } from "@/app/type";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Page = () => {

    const searchParams = useSearchParams();   
    const id = searchParams.get('id');  
    const [sale, setSale] = useState<Sale | null>(null);;

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
    if (sale) {
        printDocument();
    }
    }, [sale]);

    const fetchData = async (): Promise<void> => {
        const res = await axios.get<Sale>(config.apiUrl+'/sale/info/'+id);
        setSale(res.data);
    }

   const printDocument = () => {
    

    const style = document.createElement('style');
    style.id = 'print-style';
    style.textContent = `
        @media print {
            body * {
                visibility: hidden;
            }

            #print-content,
            #print-content * {
                visibility: visible;
                font-family: 'Courier New', monospace;
            }

            #print-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 80mm;
                padding: 8px;
                font-size: 12px;
                line-height: 1.4;
            }

            .content-header {
                display: none;
            }

            .receipt-title {
                text-align: center;
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 6px;
            }

            .receipt-sub {
                text-align: center;
                font-size: 11px;
                margin-bottom: 6px;
            }

            .divider {
                border-top: 1px dashed #000;
                margin: 6px 0;
            }

            .row {
                display: flex;
                justify-content: space-between;
                margin: 2px 0;
            }

            .total {
                font-weight: bold;
                font-size: 14px;
            }

            .footer {
                text-align: center;
                margin-top: 8px;
                font-size: 11px;
            }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => window.print(), 300);
};

    return (
        <div>
            <h1 className="content-header">พิมพ์บิล</h1>
            <div className="py-2 ">
                <button className="button-plus text-xl " onClick={printDocument}>
                    <i className="fa fa-print me-3"></i>
                    พิมพ์บิล
                </button>
            </div>
           <div id="print-content">
                <div className="receipt-title text-center text-3xl">Mobile Store</div>
                <div className="receipt-sub text-center">ใบเสร็จรับเงิน</div>
                <hr />

                <div className="divider"></div>

                <div>วันที่: {dayjs(sale?.payDate).format('DD/MM/YYYY')}</div>
                <div>เลขที่บิล: #{sale?.id}</div>

                <div className="divider"></div>

                <div className="row">
                    <span>สินค้า</span>
                    <span>{sale?.product.name}</span>
                </div>

                <div className="row total">
                    <span>รวม</span>
                    <span>{sale?.price?.toLocaleString()} บาท</span>
                </div>

                <div className="divider"></div>

                <div className="footer">
                    ขอบคุณที่ใช้บริการ<br />
                    โทร. 025-125-1478
                </div>
            </div>
        </div>
    )
}

export default Page;