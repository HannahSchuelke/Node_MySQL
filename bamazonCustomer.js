// -- Declarations
var mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
require("dotenv").config();

// -- Connecting to MySQL, settings
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: process.env.password,
    database: "bamazon"
});
// calling connect method to mySQL
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    startApp();
});
// function to display products, price, quantity
// AS = aliases 
function displayProducts() {
    connection.query("SELECT product_name AS 'Product', department_name AS 'Department', price AS 'Sales Price', stock_quantity AS 'In Stock' FROM products",
        (err, results, fields) => {
            if (err) {
                throw err;
            }
            console.table(results);

            // console.log(results);
            // .map runs a function on ever item on the array and returns a new array
            const productArray = results.map(itemInArray => itemInArray.Product);
            // const productArray2 = results.map(product => {
            //   return product.Product
            // })

            // equivalent code to .map() 
            // const productChoiceArray = [];

            // for(let i = 0; i < results.length; i++){
            //   productChoiceArray.push(results[i].Product);
            // }
            // console.log("with .map(): ", productArray);
            // console.log("without .map(): ", productChoiceArray);

            promptCustomer(productArray);


        })
}

function startApp() {
    displayProducts();
}

function promptCustomer(availableItems) {
    inquirer.prompt([
        {
            type: "list",
            message: "What product would you like to buy?",
            choices: availableItems,
            name: "customerSelection"
        },
        {
            type: "input",
            message: "How many would you like to buy?",
            name: "purchaseQuantity",
            validate: (value) => {
                //   makes it so you cannot type a word in for quantity
                return !isNaN(value);
            }
        }
    ]).then(customerSelection => {
        checkAvailability(customerSelection);
    });
}

function checkAvailability(customerData) {
    // object destructuring  
    let { customerSelection, purchaseQuantity } = customerData;

    // equivalent code:
    // let product = customerData.customerSelection;
    // let quantity = customerData.purchaseQuantity;

    // console.log("customerSelection: ", customerSelection);
    // console.log("purchaseQuantity: ", purchaseQuantity);

    // console.log("product: ", product);
    // console.log("quantity: ", quantity);

    connection.query("SELECT stock_quantity, product_name, price FROM products WHERE product_name=?", [customerSelection], (err, results, fields) => {
        if (err) {
            throw err;
        }


        let stock_quantity = results[0].stock_quantity;
        let productPrice = results[0].price;
        let remainingItems = stock_quantity - purchaseQuantity;
        let salesPrice = productPrice * purchaseQuantity;


        if (remainingItems > -1) {
            if (purchaseQuantity > 1) {
                console.log(`You just purchased ${purchaseQuantity} ${customerSelection}s for $${salesPrice}`);
            } else {
                console.log(`You just purchased ${purchaseQuantity} ${customerSelection} for $${salesPrice}`);
            }

            return updateDatabase(customerSelection, remainingItems, salesPrice);
        }

        console.log("Sorry, we have insufficient quantity");
        return continueShoppingPrompt();

    });

}

function updateDatabase(itemName, itemInventory, totalSales) {

    connection.query("UPDATE products SET ? WHERE ?", [
        {
            stock_quantity: itemInventory
        },
        {
            product_name: itemName
        }
    ], (err, results, fields) => {
        if (err) {
            throw err;
        }

        return continueShoppingPrompt();
    });

}

async function continueShoppingPrompt() {
    const continuePrompt = await inquirer.prompt(
        [
            {
                type: "confirm",
                message: "Would you like to continue shopping?",
                name: "continue"

            }
        ]
    );
    // continuePrompt would be the variable inside .then()
    if (continuePrompt.continue) {
        return displayProducts();
    }

    console.log('Thank you for shopping, please come back soon!');
    connection.end();
}