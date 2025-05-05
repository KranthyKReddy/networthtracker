const express = require('express');
const path = require('path');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt')


const app = express();
app.use(express.json())

const dbPathUsers = path.join(__dirname, Parent.db);

let dbUsers = null;

const initializeDbAndServer = async () => {
    try {
        dbUsers = await open ({
            fileName: dbPathUsers,
            driver: sqlite3.Database,
        })
        app.listen(3000, () => {
            console.log("Server is Running at http://localhost:3306");
        })
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
}

initializeDbAndServer();

const authenticationToken = (request, response, next) => {
    let jwtToken;

    const authHeader = request.Headers['authorization']
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(" ")[1]
    }
    if (authHeader === undefined) {
        response.status(401)
        response.send("Invalid JWT Token")
    } else {
        jwt.verify(jwtToken, 'SECRET_TOKEN', async (request, response) => {
            if (error) {
                response.status(401)
                response.send("Invalid JWT Token")
            } else {
                next()
            }
        })
    }
}

app.get('/users', authenticationToken, async (request, response) => {
    const userData = `SELECT * FROM users`;

    const users = await dbUsers.get(userData);
    const responseCode = await response.status();

    if (responseCode === 200) {
        response.send("Users Data fetched Successfully!");
    } else {
        response.send(responseCode);
        response.send(users)
    }
})

app.delete('/users', authenticationToken, async (request, response) => {
    const usersDeleteRequest = `DELETE FROM users`

    const usersDeleteResponse = await dbUsers.run(usersDeleteRequest)
    const responseCode = await response.status()

    if (responseCode === 200) {
        response.send("Users deleted Successfully!")
    } else {
        response.send(responseCode)
    }
})

app.delete('/users/:userId', authenticationToken, async (request, response) => {
    const {id} = request.params

    const userDeleteRequest = `DELETE FROM users WHERE user_id= ${id}`

    const userDeleteResponse = await dbUsers.run(userDeleteRequest)
    const responseCode = await response.status()

    if (responseCode === 200) {
        response.send("User deleted Successfully!")
    } else {
        response.send(responseCode)
    }
})

app.get('/users/:userID', authenticationToken, async (request, response) => {
    const {id} = request.params
    
    const userData = `SELECT * FROM users WHERE user_id= ${id}`;

    const user = await dbUsers.get(userData);
    const responseCode = await response.status()
    
    if (responseCode === 200) {
        response.send("User Data fetched Successfully!")
    } else {
        response.send(responseCode)
    }
})

app.put('/users', authenticationToken, async (request, response) => {
    const {id, name, username, email, address, password, createdOn} = request.params;

    const newUserUpdateRequest = `
    INSERT INTO 
    users (user_id, name, username, email, address, password, created_on) 
    VALUES ${id, name, username, email, address, password, createdOn}`;

    const newUserUpdateResponse = await dbUsers.run(newUserUpdateRequest);
    const responseCode = await response.status()

    if (responseCode === 200) {
        response.send("User Data fetched Successfully!")
    } else {
        response.send(responseCode)
    }
})

app.put('/customers', authenticationToken, async (request, response) => {
    const {id, shopkeeper_id, name, phone, address, created_on} = request.params;

    const customerDetails = `INSERT INTO customers (
        user_id,
        shopkeeper_id,
        name,
        phone,
        address,
        created_on) VALUES ${id, shopkeeper_id, name, phone, address, created_on}
      `

    const newUserUpdateResponse = await dbUsers.run(customerDetails);
    const responseCode = await response.status()

    if (responseCode === 200) {
        response.send("User Data fetched Successfully!")
    } else {
        response.send(responseCode)
    }
})

module.exports = app