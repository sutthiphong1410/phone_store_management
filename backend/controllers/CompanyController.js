const {PrismaClient} = require('../generated/prisma/client');
const prisma = new PrismaClient();

module.exports = {
    CompanyController: {
        create: async (req,res) => {
            try{
                const oldCompany = await prisma.company.findFirst();
                const payload = {
                    name: req.body.name,
                    address: req.body.address,
                    phone: req.body.phone,
                    email: req.body.email ?? '',
                    taxCode: req.body.taxCode ?? ''
                }
                if(oldCompany){
                    await prisma.company.updateMany({
                        where: {id: oldCompany.id},
                        data: payload
                    });
                    return res.status(200).json({message: 'success'});
                }else{
                    await prisma.company.create({
                        data: payload
                    });
                }

                res.status(201).json({message: 'success'});
            }catch(error){
                console.error(error);
                res.status(500).json({message: 'Internal server error'});
            }
        },
        list: async (req,res) => {
            try{
                const company = await prisma.company.findFirst();
                if(!company){
                    return res.status(404).json({message: 'Company not found'});
                }

                res.status(200).json(company);
            }catch(error){
                console.error(error);
                res.status(500).json({message: 'Internal server error'});
            }
        }

    }
}