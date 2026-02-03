const {PrismaClient} = require('../generated/prisma/client');
const prisma = new PrismaClient();

module.exports = {
    SaleController: {
        create: async (req,res) => {
            try{
                const serial = req.body.serial;
                const product = await prisma.product.findFirst({
                    where: {
                        serial: serial,
                        status: 'instock'
                    }
                });
                if(!product){
                    return res.status(404).json({message: 'Product not found'});
                }
                await prisma.sale.create({
                    data: {
                        productId: product.id,
                        price: req.body.price,
                        payDate: new Date()
                    }
                });
                res.status(201).json({message: 'success'})  ;

            }catch(error){
                console.error(error);
                res.status(500).json({message: 'Internal server error'});
            }
        },
        list: async (req,res) => {
            try{
                const sales = await prisma.sale.findMany({
                    where:{
                        status: 'pending'
                    },
                    orderBy:{
                        id: 'desc'
                    },
                    select:{
                        product: {
                            select: {
                                name: true,
                                serial: true
                            }
                        },
                        id: true,
                        price: true, 
                    },
                 
                       
                    
                });
                res.status(200).json(sales);
            }catch(error){
                console.error(error);
                res.status(500).json({message: 'Internal server error'});
            }
        },
        remove: async (req,res) => {
            try{
                await prisma.sale.delete({
                    where:{
                        id: req.params.id
                    }
                });
                res.status(200).json({message: 'success'});
            }catch(error){
                console.error(error);
                res.status(500).json({message: 'Internal server error'});
            }
        },
        confirm: async (req,res) => {
            try{
                const sales = await prisma.sale.findMany({
                    where:{
                        status: 'pending'
                    }
                });

                for(const sale of sales){
                    await prisma.product.update({
                        where:{
                            id: sale.productId
                        },
                        data:{
                            status: 'sold'
                        }
                    });
                }

                await prisma.sale.updateMany({
                    where:{
                        status: 'pending'
                    },
                    data:{
                        status: 'paid',
                        payDate: new Date()
                    }
                });
                res.status(200).json({message: 'success'});
            }catch(error){
                console.error(error);
                res.status(500).json({message: 'Internal server error'});
            }
        },
        dashboard: async (req,res) => {
            try{
                const year = parseInt(req.params.year) || new Date().getFullYear();
                const startDate = new Date(`${year}-01-01`);
                const endDate = new Date(`${year+1}-01-01`);
                const income = await prisma.sale.aggregate({
                    _sum: {
                        price: true
                    },
                    where:{
                        status: 'paid',
                        payDate: {
                            gte: startDate,
                            lt: endDate
                        }
                    }
                });
                const repairsCount = await prisma.service.count();
                const salesCount = await prisma.sale.count({
                    where:{
                        status: 'paid',
                        payDate: {
                            gte: startDate,
                            lt: endDate
                        }
                    }
                });

                res.json({
                    income: income._sum.price || 0,
                    repairsCount: repairsCount,
                    salesCount: salesCount
                });

            }catch(error){
                console.error(error);
                res.status(500).json({message: 'Internal server error'});
            }
        },
        history: async (req,res) => {
            try{
                const sales = await prisma.sale.findMany({
                    where:{
                        status: 'paid'
                    },
                    orderBy:{
                        id: 'desc'
                    },
                    include:{
                        product:{
                            select:{
                                name: true,
                                serial: true
                        }
                    }
                    }
                });
                res.status(200).json(sales);
            }catch(error){
                console.error(error);
                res.status(500).json({message: 'Internal server error'});
            }
        },
        info: async (req,res) => {
            try{
                const sale = await prisma.sale.findUnique({
                    where:{
                        id: req.params.id,
                        status: 'paid'
                    },
                    include:{
                        product:true
                    }
                });
                res.status(200).json(sale);
            }catch(error){
                console.error(error);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    }
}