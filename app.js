const express = require('express');
const {Web3} = require('web3');
const MyContract = require("./build/contracts/MyContract.json");
const contractABI = MyContract.abi;
const contractAddress = '0x68A13418f12adBED7bF3e72a531a57293f0FA588'; // Enter your contract address here 
const rpcEndpoint = 'http://127.0.0.1:8545'; // Enter your RPC server endpoint URL here 
const path = require("path")

const app = express();
const web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint));

const contract = new web3.eth.Contract(contractABI, contractAddress);

app.use(express.urlencoded({extended:false}))
app.set("view engine","ejs")
app.set("views", path.join(__dirname, "views"))

app.get('/', async (req, res) => {
    res.render("home",{message:"test contract"});
});

app.get('/number/get', async (req, res) => {
    const number = await contract.methods.getNumber().call();
    res.render("home", { message: 'the number is '+number });
});

app.post('/number/set', async (req, res) => {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.setNumber(req.body.number).send({ from: accounts[0] });
    res.render("home", { message: 'number set successfully' });
});

app.post('/number/add', async (req, res) => {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.addNumber(req.body.number).send({ from: accounts[0] });
    res.render("home", { message: 'number added successfully' });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});