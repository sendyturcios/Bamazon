
let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({

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
        console.log("===========================================================");
        for (let i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id + " | " + res[i].product_name + " | " + "PRICE: " + res[i].price);
            console.log("===========================================================");

        };
        start(res);
    })
});


//Asks the user what they would like to do 
function start() {
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
        

            }
        });
}



//Ask customer the item id and quantity they'd like to purchase

function searchProducts() {
    inquirer
        .prompt([
            {
                name: "itemId",
                type: "input",
                message: "Please enter the ID number of the product you would like to purchase."
            },
            {
                name: "requestedQty",
                type: "input",
                message: "Please enter the quantity",
                //ensures user input is valid 
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }

            }
        ]).then(function (answer) {


            //If there are enough products in stock, inventory is deducted on Mysql and item added to order

            connection.query(
                "SELECT * FROM products WHERE ?", { item_id: answer.itemId }, function (err, res) {
                    if (err) throw err;
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].stock_quantity > answer.requestedQty) {
                            let totalPrice = answer.requestedQty * res[i].price;

                            //Customer receipt of purchase
                            console.log("Added item(s) to order!")
                            console.log(
                                "\nOrder Invoice:" +
                                "\nItem(s): " + res[i].product_name +
                                "\nQuantity: " + answer.requestedQty +
                                "\n--------------------------" +
                                "\nOrder Total: $" + totalPrice +
                                "\n==========================");


                            //Update inventory list    
                            connection.query(
                                "UPDATE products SET ? WHERE ?",
                                [
                                    { stock_quantity: res[i].stock_quantity - answer.requestedQty },
                                    { item_id: answer.itemId }
                                ],
                                function (err, res) {
                                    if (err) throw err;

                                }
                            )



                        } else
                            //If not enough in stock, message lets customer know how many remaining and they are
                            //prompted to begin again to input different quantity 
                            console.log("We're sorry! Not enough to fulfill order. Only " + res[i].stock_quantity + " item(s) in stock. Please start your order again.");
                        start();



                    };
                });
        }
        )

};

