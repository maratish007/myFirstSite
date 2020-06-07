const host = "localhost"
const http = require('http');
const fs = require('fs');
const bodyParser = require("body-parser");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
let jsonParser = bodyParser.json();
const {Client} = require('pg')
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const tokenKey = 'HeyBroNiceProga';
const axios = require('axios');

console.log('server start');

http.createServer(function (req, res) {
    jsonParser(req, res, (error) => {
        if (req.url != '/favicon.ico') {
            console.log('\nNew request');
            console.log(req.url)
            let cook = req.headers.cookie
            let validToken = false
            //console.log(cook)
            if (cook) {
                validToken = checkToken(req)
                //console.log(validToken)
            }
            if ((req.url.indexOf("/auth/") != -1 && validToken) || req.url.indexOf("/auth/") == -1) {

                if (req.url.indexOf(".html") != -1 || req.url == '/') {
                    getHtml(req.url, res);
                } else if (req.url.endsWith('.css')) {
                    getCss(req.url, res);
                } else if (req.url.endsWith('.js')) {
                    getJS(req.url, res);
                } else if (req.url.endsWith('.png')) {
                    getPicture(req.url, res);
                } else if (req.url.endsWith('sendcode')) {
                    let code = randomInteger(100000, 999999);
                    //если все хорошо, добавляет аккаунт во временную базу
                    regCheck(req.body.email, req.body.password, code)
                    .then((ans) => {
                        if (ans) {
                            console.log("Емейл отправь " + code)
                            //sendEmail(req.body.email, code)
                        }
                        res.end(JSON.stringify(ans));
                    })
                    .catch((err) => console.log(err));
                } else if (req.url.endsWith('checkcode')) {
                    //если все хорошо, добавляет аккаунт в основную базу
                    codeCheck(req.body.email, req.body.code)
                    .then((result) => {
                        res.end(JSON.stringify(result))
                    })
                } else if (req.url.endsWith('setcookie')) {
                    setCookie(req, res);
                } else if (req.url.endsWith('/auth/fillfields')) {
                    userInfoReturner(req, res);
                } else if (req.url.endsWith('/auth/getHistory')) {
                    historyReturner(req, res);
                } else if (req.url.endsWith('/auth/makeorder')) {
                    addOrder(req, res);
                }
            } else {
                res.setHeader('Content-Type', 'text/plain');
                res.statusCode = 404;
                res.end("Token not valid, please reautorise")
                /*
                    getHtml('/main.html', res);
                */
            }
        }
    })
}).listen(5000);

async function addOrder(req, res) {
    let client = new Client({
        user: "postgres",
        password: "123",
        host: host,
        port: 5432,
        database: "DB_forsite"
    })

    await client.connect()
    .then(() => client.query(`INSERT INTO spravki(user_id, date, type, description, quantity, facultet, solved)
                            VALUES ($1, $2, $3, $4, $5, $6, $7);`, 
        [req.user.userId, req.body.date, req.body.type, req.body.description, req.body.quantity, req.body.facultet, req.body.solved]))
    .catch(e => console.log(e))
    .finally(() => client.end())
    res.end()
}

async function historyReturner(req, res) {
    let client = new Client({
        user: "postgres",
        password: "123",
        host: host,
        port: 5432,
        database: "DB_forsite"
    })

    let answer = []

    await client.connect()
    .then(() => client.query(`SELECT spravka_id, date, type, description, quantity, solved 
        FROM spravki WHERE user_id = $1
        ORDER BY date DESC`, 
        [req.user.userId]))
    .then((result) => {
        answer = result.rows;
    })
    .catch(e => console.log(e))
    .finally(() => client.end())
    res.end(JSON.stringify(answer))
}

async function getRuz(email) {
    let result = {  
        found: false
    }
    await axios.get('https://ruz.hse.ru/api/studentinfo?email=' + email)
    .then((response) => {
        fio = response.data.fio.split(' ')
        info = response.data.info.split(' ')
        result.fName = fio[0]
        result.mName = fio[1]
        result.lName = fio[2]
        result.facultet = info[2].slice(0, 3)
        result.education_form = info[0]
        result.group = info[2]
        result.found = true
    })
    .catch((error) => {
        console.log(error);
    })
    return result
}

async function userInfoReturner(req, res) {
    let client = new Client({
        user: "postgres",
        password: "123",
        host: host,
        port: 5432,
        database: "DB_forsite"
    })

    let answer = {
        fName: "No info",
        mName: "No info",
        lName: "No info",
        facultet: "No info",
        group: "No info"
    }

    await client.connect()
    .then(() => client.query("SELECT fname, mname, lname, facultet, grupa FROM user_info WHERE id = $1", 
        [req.user.userId]))
    .then(result => {
        answer.fName = (result.rows)[0].fname
        answer.mName = (result.rows)[0].mname
        answer.lName = (result.rows)[0].lname
        answer.facultet = (result.rows)[0].facultet
        answer.group = (result.rows)[0].grupa
    })
    .catch(e => console.log(e))
    .finally(() => client.end())
    res.end(JSON.stringify(answer))
}

function cookieParser(cookie) {
    //измени куку парсер если в куке дофига всего
    let list = cookie.split(';')
    let answer = "";
    for (let i = 0; i < list.length; i++) {
        if (list[i].indexOf('token') != -1) {
            answer = list[i].split('=')[1].split(' ')[1]
            break;
        }
    }
    return answer
}

function checkToken(req) {
    let token = cookieParser(req.headers.cookie)
    let answer = null
    jwt.verify(token, tokenKey, (err, user) => {
        if (err) {
            answer = false
        } else {
            req.user = user
            //console.log("Token info: ", user)
            answer = true
        }
    })
    return answer
}

async function setCookie(req, res) {
    let userEx = await enterTry(req.body.email, req.body.password)
    console.log("userEx", userEx)
    let token = "";
    if (userEx) {
        //генерациятокена токена
        token = jwt.sign({
            email: userEx.email,
            userId: userEx.id
        }, tokenKey, {expiresIn: 6000})
        token = 'Bearer ' + token + ";"
        res.setHeader("set-cookie", "token=" + token)
    }
    //если комбинация логина и пароля неверна
    //спроси у глуща надо ли удалять куку
    res.end(JSON.stringify(token))
}

async function enterTry(email, password) {
    let client = new Client({
        user: "postgres",
        password: "123",
        host: host,
        port: 5432,
        database: "DB_forsite"
    })

    let answer = null
    let truAnswer = null

    await client.connect()
    .then(() => client.query("SELECT email, id, password FROM users WHERE email = $1", [email]))
    .then(result => {
        if (result.rows.length == 0) {
            answer = false
            truAnswer = false
        } else {
            answer = bcrypt.compareSync(password, (result.rows)[0].password)
            if (answer) {
                truAnswer = (result.rows)[0]
            }
        }
    })
    .catch(e => console.log(e))
    .finally(() => client.end())

    return truAnswer
}

async function codeCheck(email, code) {
    let ans = null
    let info = await getRuz(email)
    let client = new Client({
        user: "postgres",
        password: "123",
        host: host,
        port: 5432,
        database: "DB_forsite"
    })
    await client.connect()
    .then(() => client.query("SELECT password, code FROM not_proved_users WHERE email = $1", [email]))
    .then(results => {
        console.log((results.rows)[0])
        if ((results.rows)[0].code == code) {
            return client.query("INSERT INTO users (email, password) VALUES ($1, $2);", [email, (results.rows)[0].password])
                .then(() => {ans = true})
        } else {
            throw new Error("No such email and password");
        }
    })
    .then(() => client.query("DELETE FROM not_proved_users WHERE email = $1;", [email]))
    .then(() => console.log(info))
    .then(()=> client.query("SELECT id FROM users WHERE email = $1;", [email]))
    .then((result) => client.query("INSERT INTO user_info (id, fname, mname, lname, facultet, ed_form, grupa) VALUES ($1, $2, $3, $4, $5, $6, $7);",
        [(result.rows)[0].id, info.fName, info.mName, info.lName, info.facultet, info.education_form, info.group]))
    .catch((e) => {console.log(e); ans = false})
    .finally(() => client.end())
    return ans

}

async function regCheck(email, password, code) {
    let client = new Client({
        user: "postgres",
        password: "123",
        host: host,
        port: 5432,
        database: "DB_forsite"
    })
    let inNotUsers = null
    let inUsers = null
    let answer = null
    await client.connect()
    .then(() => client.query("SELECT email FROM not_proved_users WHERE email = $1", [email]))
    .then(results => {
        if (results.rows.length == 0) {
            inNotUsers = false
        } else {
            inNotUsers = true
        }
    })
    .then(() => client.query("SELECT email FROM users WHERE email = $1", [email]))
    .then(results => {
        if (results.rows.length == 0) {
            inUsers = false
        } else {
            inUsers = true
        }
    })
    .then(() => {
        if (inUsers) {
            answer = false 
        } else if (inNotUsers) {
            return client.query("UPDATE not_proved_users SET email=$1, password=$2, code=$3 WHERE email = $1", 
                [email, bcrypt.hashSync(password, salt), code]).then(() => { answer = true})
        } else {
            return client.query("INSERT INTO not_proved_users (email, password, code) VALUES ($1, $2, $3)",
            [email, bcrypt.hashSync(password, salt), code]).then(() => {answer = true})
        }
    })
    .catch(e => console.log(e))
    .finally(() => client.end())
    console.log(inNotUsers, inUsers, answer)
    return answer;

}

function getHtml(name, res, statusCode = 200) {
    if (name == '/') {
        name = '/main.html'
    };
    name = name.slice(0, name.indexOf(".html") + 5)
    fs.readFile('pages' + name, (err, data) => {
        console.log('pages' + name);
        if (!err) {
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = statusCode;
            res.end(data);
            return
        } else {
            console.log(err);
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 404;
            res.end("404 Page not found")
        }
    })
}

function getPicture(name, res) {
    fs.readFile(name.slice(1), (err, data) => {
        console.log(name.slice(1))
        if (!err) {
            res.setHeader('Content-Type', 'image/png');
            res.statusCode = 200;
            res.end(data);
            return
        } else {
            console.log(err);
        }
    })
}

function getCss(name, res, statusCode = 200) {
    fs.readFile('styles' + name, (err, data) => {
        console.log('styles' + name)
        if (!err) {
            res.setHeader('Content-Type', 'text/css');
            res.statusCode = statusCode;
            res.end(data);
            return
        } else {
            console.log(err);
        }
    })
}

function getJS(name, res, statusCode = 200) {
    fs.readFile('scripts' + name, (err, data) => {
        console.log('scripts' + name)
        if (!err) {
            res.setHeader('Content-Type', 'text/javascript');
            res.statusCode = statusCode;
            res.end(data);
            return
        } else {
            console.log(err);
        }
    })
}

function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}


function sendEmail(email, code) {
    let data = {
    from: "kek@krsq.me",
    to: email,
    subject: "Please, verify your account",
    text: "Your code is: " + code + "."
    };
    sgMail.send(data);
    return
}
