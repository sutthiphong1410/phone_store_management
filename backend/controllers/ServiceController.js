const {PrismaClient} = require('../generated/prisma/client');
const prisma = new PrismaClient();

module.exports = {
    ServiceController: {
        create: async (req,res) => {
            try{
                await prisma.service.create({
                    data: {
                        name: req.body.name,
                        price: req.body.price,
                        remarks: req.body.remarks,
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
                const services = await prisma.service.findMany({
                    orderBy:{
                        payDate:'asc'
                    }
                
                });
                res.status(200).json(services);
            }catch(error){
                console.error(error);
                res.status(500).json({message: 'Internal server error'});
            }
        },
        update: async (req,res) => {
            try{
                await prisma.service.update({
                    where:{
                        id: req.params.id
                    },
                    data:{
                        name: req.body.name,
                        price: req.body.price,
                        remarks: req.body.remarks
                    }
                });
                res.status(200).json({message: 'success'});

            }catch(error){
                console.error(error);
                res.status(500).json({message: 'Internal server error'});
            }
        },
        remove: async (req,res) => {
            try{
                await prisma.service.delete({
                    where:{
                        id: req.params.id
                    }
                });
                res.status(200).json({message: 'success'});

            }catch(error){
                console.error(error);
                res.status(500).json({message: 'Internal server error'});
            }
        }
    }

};