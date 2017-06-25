var mysql = require('mysql');
var inquirer = require('inquirer');

// create the connection for the sql database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'root',
	database: 'biebay'
});

connection.connect(function(err, results){
	if (err) throw err;
	console.log('this is connected!');
	console.log('Are you a Belieber? You will be after you see these amazing items on sale: ');
	seeItems();
})

// function that shows items after the connection has been made to the db
function seeItems() {
	connection.query('SELECT * FROM products', function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].item_id + '. ' + res[i].product_name + ' | Price: ' + res[i].price);
		}
		console.log('=========================================');
		firstPrompt();
	})
}

function firstPrompt() {
	inquirer.prompt([
		{
			type: 'input',
			message: 'What product are you interested in purchasing? Please type in an item id',
			name: 'userInput'
		}
	]).then(function (answer){
		 connection.query("SELECT * FROM products", function(err, res){
		 		for (var i = 0; i < res.length; i++) {
		 			if (answer.userInput === JSON.stringify(res[i].item_id)){
		 				console.log('You have chosen: ' + res[i].product_name + 'That is an excellent product!')
			 			} // end of if statement
			 		} 
			 		secondPrompt();
			 	} // end of connection query
			 })
		})
	}

function secondPrompt() {
	inquirer.prompt([
		{
			type: 'input',
			message: "How much of the item would you like?",
			name: 'userInput2',
			validate: function(value){
				if (isNan(value) === false) {
					return true;
				}
				return false;
			}
		}
	]).then(function (answer) {
		connection.query('SELECT * FROM products', function(err, res){
			for (var i = 0; i < res.length; i++){
				if (answer.userInput2 === JSON.stringify(res[i].stock_quantity)){
					console.log('Yes! We have enough stock!');
				}
			}
		});
	});
}