var mysql = require('mysql');
var inquirer = require('inquirer');

// create the connection for the sql database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'biebay'
});

connection.connect(function(err){
	if (err) throw err;
})