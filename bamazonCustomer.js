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
// function to display products, department, price, quantity
function displayProducts() {
    connection.query("SELECT product_name AS 'Product', department_name AS 'Department', price AS 'Sales Price', stock_quantity AS 'In Stock' FROM products",
        (err, results, fields) => {
            if (err) {
                throw err;
            }
            console.table(results);
// .map runs a function on every item on the array and returns a new array
            const productArray = results.map(itemInArray => itemInArray.Product);
            promptCustomer(productArray);
        })
}
// Function to start App, calling display products
function startApp() {
    displayProducts();
}
// Function to prompt customer before and after selection
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
//  This makes it so you cannot type a word in for quantity
                return !isNaN(value);
            }
        }
    ]).then(customerSelection => {
        checkAvailability(customerSelection);
    });
}
// Function to make sure there is enough quanitity to fulfill purchase
function checkAvailability(customerData) {
// Object destructuring  
    let { customerSelection, purchaseQuantity } = customerData;
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
// Function to update Database
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
// Prompt to ask us if we would like to continue shopping
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
// continuePrompt will be the variable inside .then()
    if (continuePrompt.continue) {
        return displayProducts();
    }
// Ending goodbyes
    console.log('Thank you for shopping, please come back soon!');
    connection.end();
}