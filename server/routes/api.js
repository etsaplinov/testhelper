//import { resolve } from 'url';
// const express = require('express');
const express = require('express');
const router = express.Router();
// const express = require('express');
// const cors = require('cors');
const fs = require('fs');
const path = require('path');
const appRoot = require('app-root-path');
const multer = require('multer'); // v1.0.5
const upload = multer(); // for parsing multipart/form-data
// const bodyParser = require('body-parser');

// import { Category, Product } from '../domain/repository/dbContext';

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = '';

let passFilePath = path.resolve(appRoot.path, 'server', 'cryptpass.txt');
if (fs.existsSync(passFilePath)) {
    password = fs.readFileSync(passFilePath).toString();
} else
    throw "Password not found";


function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}


// app.use(cors());
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



// let questions = new Map();
// let session = new Map();

let getMd5 = (source) => {
    return crypto.createHash('md5').update(source.trim().toLowerCase()).digest("hex");
};


const readFileToMap = (filePath) => {
    console.log("file to map", filePath);
    if (fs.existsSync(filePath)) {
        var fileData = fs.readFileSync(filePath);
        if (filePath.endsWith(".cr"))
            fileData = decrypt(fileData.toString());
        console.log("File data", JSON.parse(fileData));
        return new Map(JSON.parse(fileData));
    } else
        return new Map();
}

// let _filePath = path.resolve(appRoot.path, 'server', 'tests', "questions_bootstrap.json");
// let _fileName = "questions_bootstrap.json"

const getFilePath = (fileName) => {
    fileName = !fileName ? _fileName : fileName;
    return path.resolve(appRoot.path, 'server', 'encryptedtests', fileName);
}

const saveMapToFile = (path, map) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, encrypt(JSON.stringify([...map])), function(err) {
            if (err) {
                reject(err);
            }

            resolve();
        });
    });
}


// if (fs.existsSync(getFilePath()))
//     fs.readFile(getFilePath(), (err, data) => {
//         if (err) throw err;
//         questions = new Map(JSON.parse(data));
//         //console.log(JSON.stringify([...questions]));
//         console.log(`Tests count = ${questions.size}`);
//     });

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/tests', (req, res) => {
    res.json({
        tests: fs.readdirSync(path.resolve(appRoot.path, 'server', 'encryptedtests')).filter(file => {
            return file.startsWith('questions_');
        }),
        sessions: fs.readdirSync(path.resolve(appRoot.path, 'server', 'encryptedtests')).filter(file => {
            return file.startsWith('session_');
        })
    });
});

router.get('/questions/:name', (req, res) => {
    let fileName = req.params.name;
    let questions = readFileToMap(getFilePath(fileName));
    return res.json([...questions]);

    // if (fs.existsSync(getFilePath()))
    //     fs.readFile(getFilePath(), (err, data) => {
    //         if (err) throw err;
    //         questions = new Map(JSON.parse(data));
    //         return res.json([...questions]);
    //     });
    // else
    //     throw "Not found";
});

router.post('/changecorrectstate', upload.array(), (req, res) => {
    try {

        // console.log(req.body);

        let body = JSON.parse(req.body.json);

        let {
            questionKey,
            answerKey,
            isCorrect,
            testName
        } = body;

        let pathToQuestions = getFilePath(testName);
        let localQuestions = readFileToMap(pathToQuestions);

        // console.log(questionKey, answerKey, isCorrect);

        var question = localQuestions.get(questionKey);

        for (let a of question.answers) {
            if (a.md5 === answerKey) {
                a.isCorrect = isCorrect;
                break;
            }
        }

        localQuestions.set(questionKey, question);

        return saveMapToFile(pathToQuestions, localQuestions).then(() => {
            return res.json({ success: true });
        }).catch(err => { throw err; });
    } catch (ex) {
        return res.json({ success: false, error: ex });
    }

});

router.post('/changeimsurestate', upload.array(), (req, res) => {
    try {

        // console.log(req.body);

        let body = JSON.parse(req.body.json);

        let {
            questionKey,
            iAmSureInAnswer,
            testName
        } = body;

        let pathToQuestions = getFilePath(testName);
        let localQuestions = readFileToMap(pathToQuestions);

        var question = localQuestions.get(questionKey);

        question["iAmSureInAnswer"] = iAmSureInAnswer;

        questions.set(questionKey, question);

        return saveMapToFile(pathToQuestions, localQuestions).then(() => {
            return res.json({ success: true });
        }).catch(err => { throw err; });
    } catch (ex) {
        return res.json({ success: false, error: ex });
    }

});

router.post('/question', upload.array(), (req, res) => {

    console.log(req.body);



    let body = JSON.parse(req.body.json);
    let questionKey = getMd5(body.question);

    console.log(body);

    let answers = [];
    body.answers.map(answer => {
        answers.push({
            md5: getMd5(answer),
            answer: answer.trim(),
            isCorrect: false
        });
    });

    let pathToQuestions = getFilePath("questions_" + body.testname + ".json");
    let pathToSession = getFilePath(`session_${body.sessionKey}.questions_${body.testname}.json`);

    let localQuestions = readFileToMap(pathToQuestions);
    let session = readFileToMap(pathToSession);

    console.log(pathToQuestions);
    console.log(pathToSession);
    // console.log(JSON.stringify([...localQuestions]));
    // console.log(JSON.stringify([...session]));

    let result = { message: "" };

    //add question into questions
    if (!localQuestions.has(questionKey)) {
        localQuestions.set(questionKey, {
            question: body.question.trim(),
            note: body.note,
            answers
        });
        result.isExists = false;
        result.message = "Question not found";

        saveMapToFile(pathToQuestions, localQuestions).catch(err => {
            throw err;
        });
    } else {
        let correctAnswers = [];

        let answersDb = localQuestions.get(questionKey).answers;

        answers.map((answer, index) => {
            answersDb.map((answerDb) => {
                if (answerDb.isCorrect && answerDb.md5.localeCompare(answer.md5) == 0)
                    correctAnswers.push(index);
            });
        });

        result.isExists = true;
        result.correctAnswers = correctAnswers;
        result.message = "Question exist";

    }

    session.set(questionKey, localQuestions.get(questionKey));
    saveMapToFile(pathToSession, session);
    console.log(result);
    return res.json(result);
});

module.exports = router;