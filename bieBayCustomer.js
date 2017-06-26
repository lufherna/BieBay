// dependancies needed for this app
var mysql = require('mysql');
var inquirer = require('inquirer');

// variables that hold item data
var itemList = [];
var idChosen;
var quantityChosen;
var total;
var changeStock;


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
	console.log('Are you a Belieber? You will be after you see these amazing items on sale: ');
	seeItems();
})

// function that shows items after the connection has been made to the db
function seeItems() {
	connection.query('SELECT `item_id`, `product_name`, `price` FROM `products`', function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			itemList.push(res[i]);
			console.log("id #", itemList[i].item_id + ': ' + itemList[i].product_name, '$',itemList[i].price);
		}
		console.log('=========================================');
	inquirer.prompt([
		{
			type: 'input',
			message: 'What product are you interested in purchasing? Please type in an item id',
			name: 'userInput'
		}
	]).then(function (answer){
		idChosen = answer.userInput;
		 connection.query("SELECT `item_id`, `product_name`, `price`, `stock_quantity` FROM `products` WHERE `item_id` = ?", [idChosen], function(err, res) {
		 			if (idChosen < itemList.length){
		 				console.log('\nInvalid ID. Enter a valid product id from list\n')
			 			} else {
			 			console.log('You have chosen', res[0].product_name, 'for $' + res[0].price);
			 			checkQuantity();
			 		} 
			 	// function that checks 	
			 	function checkQuantity() {
					inquirer.prompt ([
						{
							type: 'input',
							message: 'What is the number of ' + res[0].product_name + ' ' + 'you want to buy?',
							name: 'quantity'
						}
					]).then(function (response) {
						quantityChosen = response.quantity;
						if (res[0].stock_quantity > quantityChosen){
							total = res[0].price * quantityChosen;
							changeStock = res[0].stock_quantity - quantityChosen;
							console.log('Your amount due is: $' + total);
							console.log('Thank you for your order! Please come back and spend more money!!')
							connection.query('UPDATE `products` SET `stock_quantity` = ? WHERE `item_id` = ?', [changeStock, idChosen])
						} else {
							console.log('Unable to complete your order. Not enough in stock. You can still be a Belieber though');
							console.log('There are ', res[0].stock_quantity, 'in stock');
							console.log('Choose a different quantity');
							checkQuantity();
						}
					})
				}
			 })
		})
	})
}

			 		//secondPrompt();
			 	 // end of connection query
/*function checkQuantity() {
	inquirer.prompt ([
		{
			type: 'input',
			message: 'What is the number of ' + res[0].product_name + 'you want to buy?',
			name: 'quantity'
		}
	]).then(function (res) {
		quantityChosen = res.quantity;
		if (data[0].stock_quantity > quantityChose){
			total = data[0].price * quantityChosen;
			changeStock = data[0].stock_quantity - quantityChosen;
			console.log('Your amount due is: $' + total);
			connection.query('UPDATE `products` SET `stock_quantity` = ? WHERE `item_id` = ?', [changeStock, idChosen])
		} else {
			console.log('Unable to complete your order. Not enough in stock. You can still be a Belieber though');
			console.log('There are ', res[0].stock_quantity, 'in stock');
			console.log('Choose a different quantity');
			checkQuantity();
		}
	})
}*/


	

/*function secondPrompt() {
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
		})
	})
}*/