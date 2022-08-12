var express = require('express');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var Web3 = require('web3');
const fs = require('fs');
var path = require('path');
var app = express();
const projectId = '2DANzcuNNWsEI4GOHwbxZOwDrcw';
const projectSecret = '1a49d66db9af54ef01291cb5b748442c';
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const ipfsClient = require('ipfs-http-client');
const ipfs = new ipfsClient({host:'ipfs.infura.io',port:'5001',protocol:'https', headers: {
        authorization: auth,
    },});
var fileHash='';
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'web/views'));
app.use('/public', express.static(__dirname + '/web/public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Deploy Smart Contract and place smart contract address here 
var ContractAddress = "0x7BB73B7fEC4fcCC8d39274a21a9C8a52EfDF3C73";

app.get('/', function (req, res) {
	res.render('pages/dashboard');
	// res.render("home")
})
app.get('/old', function (req, res) {
	res.render("index")
})

app.get('/AddUser', function (req, res) {
	var data = {ContractAddress:ContractAddress};
	res.render("AddUser",data);
})

app.get('/AddUserDL', function (req, res) {
	var data = {ContractAddress:ContractAddress};
	res.render("AddUserDL",data);
})

app.post('/upload', function (req,res) {

	const file = req.files.invoicefile;
	console.log(req);
	const fileName = req.files.invoicefile.name;
	const filePath = '/Users/stuff/Desktop/Research/' + fileName;
	file.mv(filePath,async (err) => {
		if (err) {
			console.log('Error: failed to download the file');
			return res.status(500).send(err);
		}

		fileHash = await addFile(fileName,filePath);

		fs.unlink(filePath, (err) => {
			if (err) console.log(err);
		});

		// var DL_Hash=fileHash;
	console.log(fileHash,'----------');
	// var MyContract = new Web3.eth.Contract(ABIJSON,ContractAddress);
	var DL_No = req.body.txtLicenceNo;
	var DL_Name = req.body.txtFullName;
	var DL_DOB = req.body.txtDOB;
	var DL_Address = req.body.txtAddress;

	var data = {ContractAddress:ContractAddress,DLHash:fileHash,DL_No:DL_No,DL_Name:DL_Name,DL_DOB:DL_DOB,DL_Address:DL_Address,fileName:fileName};
	res.render("upload",data);
	// res.render('upload',{ContractAddress:ContractAddress,fileName,fileHash,ABIJSON,DL_No,DL_Name,DL_DOB,DL_Address});


	});

	});

const addFile = async (fileName, filePath) => {
	const file = fs.readFileSync(filePath);
	const fileAdded = await ipfs.add({path: fileName,content:file});
	// const fileHash = fileAdded[0].hash;
	return fileAdded[0].hash;
}

app.get('/ViewRequest', function (req, res) {
	var data = {ContractAddress:ContractAddress};
	res.render("ViewRequest",data)
})

app.post('/ViewRequestDetail', function (req, res) {
	RequestIndex = req.body.hdnRequestIndex;
	InstitutionName = req.body.hdnInstitutionName;
	var data = {ContractAddress:ContractAddress,RequestIndex:RequestIndex,InstitutionName:InstitutionName};
	res.render("ViewRequestDetail",data);
})

app.get('/RequestAccess', function (req, res) {
	var data = {ContractAddress:ContractAddress};
	res.render("RequestAccess",data);
})

app.get('/ViewRequest_Org', function (req, res) {
	var data = {ContractAddress:ContractAddress};
	res.render("ViewRequest_Org",data);
})

app.post('/ViewRequestDetail_Org', function (req, res) {
	RequestIndex = req.body.hdnRequestIndex;
	InstitutionName = req.body.hdnInstitutionName;
	var data = {ContractAddress:ContractAddress,RequestIndex:RequestIndex,InstitutionName:InstitutionName};
	res.render("ViewRequestDetail_Org",data);
})

app.get('/Message', function (req, res) {
	var TransHash = req.query.TransHash;
	res.render("Message",{TransHash:TransHash})
})


var server = app.listen(4000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
