import { con } from "../sqlConnect";

export function getcontacts(req, res) {
    let isDeleted = 0;

    if (req.query.deleted) {
        isDeleted = 1;
    }

    con.query("SELECT * FROM `contacts` WHERE `isDeleted` = ?", [isDeleted], (err, result) => {
        if (err) {
            console.log(err);
        }

        res.send(result);
    });
}


export function getcontact(req, res) {
    con.query("SELECT * FROM `contacts` WHERE `id` = ?", [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }

        if (result.length) {
            res.send(result[0]);
        } else {
            res.send();
        }
    });
}


export function newContact(req, res) {
    const sqlQuery = "INSERT INTO `contacts`(`firstName`, `lastName`, `birthday`, `email`, `phone`, `city`) VALUES ( ?,?,?, ?,?, ?)";
    const paramArr = [req.body.firstName, req.body.lastName, req.body.birthday, req.body.email, req.body.phone, req.body.city];

    con.query(sqlQuery, paramArr, (err, result) => {
        if (err) {
            throw err;
        }

        con.query("SELECT `id`, `firstName`, `lastName`, `birthday`, `email`,`phone`, `city`,  `isDeleted` FROM `contacts` WHERE `id`= ?;", [result.insertId], (err, result) => {
            if (err) {
                throw err;
            }

            res.send(result[0]);
        });
    });
}

export function updateContact(req, res) {
    con.query("UPDATE `contacts` SET `firstName`=?,`lastName`=?,`birthday`=?,`email`=?,`phone`=?,`city`=? WHERE `id` = ?;", [req.body.firstName, req.body.lastName, req.body.birthday, req.body.email, req.body.phone, req.body.city, req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }

        res.send();
    });
}


export function removeContact(req, res) {
    con.query("UPDATE `contacts` SET `isDeleted` = 1 WHERE `id` = ? ", [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }

        res.send();
    });
}