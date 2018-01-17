//import { resolve } from 'url';
// const express = require('express');
const express = require('express');
const router = express.Router();
// const express = require('express');
// const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
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


// app.use(cors());
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



let questions = new Map();
let session = new Map();

let getMd5 = (source) => {
    return crypto.createHash('md5').update(source.trim().toLowerCase()).digest("hex");
};

const saveToFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, JSON.stringify([...questions], null, 4), function(err) {
            if (err) {
                reject(err);
            }

            resolve();
        });
    });
}

// let _filePath = path.resolve(appRoot.path, 'server', 'tests', "questions_bootstrap.json");
let _fileName = "questions_bootstrap.json"

const getFilePath = () => {
    return path.resolve(appRoot.path, 'server', 'tests', _fileName);
}

const saveSessionsToFile = (sessionKey) => {
    let sessionPath = path.resolve(appRoot.path, 'server', 'tests', "session_" + sessionKey + "." + _fileName);

    return new Promise((resolve, reject) => {
        fs.writeFile(sessionPath, JSON.stringify([...session], null, 4), function(err) {
            if (err) {
                reject(err);
            }

            resolve();
        });
    });
}


if (fs.existsSync(getFilePath()))
    fs.readFile(getFilePath(), (err, data) => {
        if (err) throw err;
        questions = new Map(JSON.parse(data));
        //console.log(JSON.stringify([...questions]));
        console.log(`Tests count = ${questions.size}`);
    });

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/tests', (req, res) => {
    res.json({
        tests: fs.readdirSync(path.resolve(appRoot.path, 'server', 'tests')).filter(file => {
            return file.startsWith('questions_');
        }),
        sessions: fs.readdirSync(path.resolve(appRoot.path, 'server', 'tests')).filter(file => {
            return file.startsWith('session_');
        })
    });
});

router.get('/questions/:name', (req, res) => {
    _fileName = req.params.name;
    session = new Map();
    if (fs.existsSync(getFilePath()))
        fs.readFile(getFilePath(), (err, data) => {
            if (err) throw err;
            questions = new Map(JSON.parse(data));
            return res.json([...questions]);
        });

    throw "Not found";
});

router.post('/changecorrectstate', upload.array(), (req, res) => {
    try {

        // console.log(req.body);

        let body = JSON.parse(req.body.json);

        let {
            questionKey,
            answerKey,
            isCorrect
        } = body;

        // console.log(questionKey, answerKey, isCorrect);

        var question = questions.get(questionKey);

        for (let a of question.answers) {
            if (a.md5 === answerKey) {
                a.isCorrect = isCorrect;
                break;
            }
        }

        questions.set(questionKey, question);

        return saveToFile(getFilePath()).then(() => {
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
            iAmSureInAnswer
        } = body;

        // console.log(questionKey, answerKey, isCorrect);

        var question = questions.get(questionKey);
        question["iAmSureInAnswer"] = iAmSureInAnswer;

        questions.set(questionKey, question);

        return saveToFile(getFilePath()).then(() => {
            return res.json({ success: true });
        }).catch(err => { throw err; });
    } catch (ex) {
        return res.json({ success: false, error: ex });
    }

});

// router.get('/remaketests', (req, res) => {
//     let newQuestions = new Map();

//     for (let q of questions) {
//         let question = q[0];

//         newQuestions.set(getMd5(question), {
//             question,
//             note: q[1].note,
//             answers: q[1].answers.map((answer) => {
//                 return {
//                     md5: getMd5(answer.answer),
//                     answer: answer.answer.trim(),
//                     isCorrect: answer.isCorrect
//                 }
//             })

//         })
//     }

//     fs.writeFile(filePath + '.new', JSON.stringify([...newQuestions], null, 4), function(err) {
//         if (err) {
//             return res.json({ error: err });
//         }

//         return res.json([...newQuestions]);
//     });


// })

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





    if (questions.has(questionKey)) {

        let correctAnswers = [];

        let answersDb = questions.get(questionKey).answers;

        answers.map((answer, index) => {
            answersDb.map((answerDb) => {
                if (answerDb.isCorrect && answerDb.md5.localeCompare(answer.md5) == 0)
                    correctAnswers.push(index);
            });
        });

        session.set(questionKey, questions.get(questionKey));
        saveSessionsToFile(body.sessionKey);

        return res.json({ message: "Question exist", isExists: true, correctAnswers });
    }



    questions.set(questionKey, {
        question: body.question.trim(),
        note: body.note,
        answers
    });

    session.set(questionKey, questions.get(questionKey));

    saveSessionsToFile(body.sessionKey);

    console.log(JSON.stringify([...questions]));

    return saveToFile(getFilePath()).then(() => {
        return res.json({ message: "fileSaved", params: body });
    }).catch(err => {
        return res.json({ error: err });
    })
});

module.exports = router;