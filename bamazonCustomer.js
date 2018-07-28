
const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({

    host: "localhost",

    port: 3306,

    user: "root",

    password: "Hello_338",

    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw (err);
        console.log("   Welcome to Bamazon! Please take a look at our products! ");
        console.log("==============================================================");
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id + " | " + res[i].product_name + " | " + "PRICE: " + res[i].price + " | " + "QTY: " + res[i].quantity);
        };
        start(res);
    })
});


//Asks the user what they would like to do 
let start = function () {
    inquirer
        .prompt({
            name: "welcome",
            type: "list",
            message: "What would you like to do?",
            choices: ["I would like to purchase an item!", "All done! Exit Bamazon please."]


        }).then(function (answer) {
            if (answer.welcome === "I would like to purchase an item!") {
                searchProducts();

            } else {
                console.log("Thank you for visiting Bamazon! Have a great day!")
                connection.end();
                process.exit();

            }
        });
}



//Ask customer the item id and quantity they'd like to purchase

function searchProducts() {
    inquirer
        .prompt({
            name: "itemId",
            type: "input",
            message: "Please enter the ID number of your desired item",
        },
        {
            name: "requestedQty",
            type: "input",
            message: "Please enter the desired quantity",
            //ensures user input is valid 
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        
        
    }) .then(function (answer) {
        let productId = parseInt(answer.itemId);
        let productQuantity = parseInt(answer.requestedQty);

        //query searches database
        var query = "SELECT item_id, product_name, quantity, price FROM products WHERE ?";
        //Lets user know if there is not enough of the product in stock
            connection.query(query, { item_id: productId }, function (err, res) {
                if (res[0].quantity < productQuantity) {
                    console.log("We're sorry! Not enough to fulfill order.");
                    start(res);
                } else 
                console.log(" Bamazon has " + res[0].quantity + " of this item in stock. Adding items to your order.")
              updateInventory();

            

            })
            })

            function updateInventory() {
                
            }







   
   
         }

         
            
        
