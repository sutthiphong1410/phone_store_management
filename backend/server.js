const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/uploads', express.static('uploads'));

const { UserController } = require('./controllers/UserController');
const { CompanyController } = require('./controllers/CompanyController');
const { ProductController } = require('./controllers/ProductController');
const { SaleController } = require('./controllers/SaleController');
const { ServiceController } = require('./controllers/ServiceController');



app.get('/', (req, res) => {
  res.send('Hello from the backend server!');
});

//User routes
app.post('/api/user/signin', UserController.signIn);
app.get('/api/user/info', UserController.info);
app.put('/api/user/update', UserController.update);
app.get('/api/user/list', UserController.list);
app.post('/api/user/create', UserController.create);
app.put('/api/user/update/:id', UserController.updateRow);
app.delete('/api/user/remove/:id', UserController.remove);

//Company routes
app.post('/api/company/create', CompanyController.create);
app.get('/api/company/list', CompanyController.list);

//Product routes
app.post('/api/buy/create', ProductController.create);
app.get('/api/buy/list/:page', ProductController.list);
app.put('/api/buy/update/:id', ProductController.update);
app.delete('/api/buy/remove/:id', ProductController.remove);
app.post('/api/buy/export', ProductController.exportToExcel);

//Sale routes
app.post('/api/sale/create', SaleController.create);
app.get('/api/sale/list', SaleController.list);
app.delete('/api/sale/remove/:id', SaleController.remove);
app.get('/api/sale/confirm', SaleController.confirm);
app.get('/api/sale/dashboard/:year', SaleController.dashboard);
app.get('/api/sale/history', SaleController.history);
app.get('/api/sale/info/:id', SaleController.info);

//Service routes
app.post('/api/service/create', ServiceController.create);
app.get('/api/service/list', ServiceController.list);
app.put('/api/service/update/:id', ServiceController.update);
app.delete('/api/service/remove/:id', ServiceController.remove);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
