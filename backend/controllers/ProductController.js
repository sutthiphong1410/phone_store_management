const {PrismaClient} = require('../generated/prisma/client');
const prisma = new PrismaClient();
const XLSX = require('xlsx');

module.exports = {
    ProductController: {
        create: async (req, res) => {
            try{
                const qty = req.body.qty;

                if(qty > 1000){
                    return res.status(400).json({ error: 'Quantity exceeds the limit of 1000' });
                }
                for(let i=0; i<qty; i++){
                    await prisma.product.create({
                        data: {
                            release:req.body.release,
                            name:req.body.name,
                            color:req.body.color,
                            price:parseInt(req.body.price),
                            customerName:req.body.customerName,
                            customerPhone:req.body.customerPhone,
                            customerAddress:req.body.customerAddress,
                            remarks:req.body.remarks?? '',
                            serial:req.body.serial?? '',
                        }
                    });
                }
                res.status(201).json({ message: 'success' });
            }catch(error){
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        },
        list: async (req, res) => {
            try{
                const page = req.params.page ?? 1;
                const limit = 5;
                const skip = (page - 1) * limit;
                const totalRows = await prisma.product.count({
                    where: {
                        status: {
                            not: 'deleted',
                        },
                    },
                });
                const totalPage = Math.ceil(totalRows / limit);

                const products = await prisma.product.findMany({
                    orderBy: {
                        id: 'desc',
                    },
                    where: {
                        status: {
                            not: 'deleted',
                            not: 'sold',
                        },
                    },
                    skip: skip,
                    take: limit,
                });
                res.status(200).json({products , totalPage, page, totalRows });
            }catch(error){
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        },
        update: async (req, res) => {
            try{
                await prisma.product.update({
                    where: {
                        id: req.params.id,
                    },
                    data: {
                        release:req.body.release,
                        name:req.body.name,
                        color:req.body.color,
                        price:parseInt(req.body.price),
                        customerName:req.body.customerName,
                        customerPhone:req.body.customerPhone,
                        customerAddress:req.body.customerAddress,
                        remarks:req.body.remarks?? '',
                        serial:req.body.serial?? '',
                    },
                });
                res.status(200).json({ message: 'success' });
            }catch(error){
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        },
        remove: async (req, res) => {
            try{
                await prisma.product.update({
                    where: {
                        id: req.params.id,
                    },
                    data: {
                        status: 'deleted',
                    },
                });
                res.status(200).json({ message: 'success' });
            }catch(error){
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        },
        exportToExcel: async (req, res) => {
            try{
                const data = req.body.products;
                const fileName = 'products_export.xlsx';

                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

                XLSX.writeFile(workbook, './uploads/' + fileName);
                res.status(200).json({ fileName: fileName });
            }catch(error){
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}