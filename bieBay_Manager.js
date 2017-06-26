var mysql = require('mysql');
var inquirer = require('inquirer');

var itemList = [];

// create the connection for the sql database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'root',
	database: 'biebay'
});
// connect to the mysql server and sql database
connection.connect(function(err, results){
	if (err) throw err;
	console.log('You are connected');
	startApp();
})

// function that begins the program
function startApp() {
	inquirer.prompt({
		name: 'managerOptions',
		type: 'list',
		message: 'What would you like to do chief?',
		choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
	}).then(function(answer){
		if (answer.managerOptions === answer.choices){
			console.log('chose view products for sale');
			// run new query depending on answer given by user
				connection.query('SELECT `item_id`, `product_name`, `price`, `stock_quantity` FROM `products`', function(err, res) {
			if (err) throw err;
			for (var i = 0; i < res.length; i++) {
				itemList.push(res[i]);
				console.log("id #", itemList[i].item_id + ': ' + itemList[i].product_name, '$',itemList[i].price + '' + itemList[i].stock_quantity);
			}

		}

	})
}