import { con } from "../sqlConnect";

export function getcustomers(req, res) {
    let isDeleted = 0;

    if (req.query.deleted) {
        isDeleted = 1;
    }

    con.query("SELECT * FROM `customers` WHERE `isDeleted` = ?", [isDeleted], (err, result) => {
        if (err) {
            console.log(err);
        }

        res.send(result);
    });
}


export function getcustomer(req, res) {
    con.query("SELECT * FROM `customers` WHERE `id` = ?", [req.params.id], (err, result) => {
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


export function newCustomer(req, res) {
    const sqlQuery = "INSERT INTO `customers`(`createdTime`, `fullName`,`phone`,`city`, `notes`,`email`, `userName`, `password`) VALUES (CURRENT_TIME, ?,?,?, ?,?, ?, MD5(?))";
    const paramArr = [req.body.fullName, req.body.phone, req.body.city, req.body.notes, req.body.email, req.body.userName.trim(), req.body.password];

    con.query(sqlQuery, paramArr, (err, result) => {
        if (err) {
            throw err;
        }

        con.query("SELECT `id`, `fullName`, `phone`, `email`, `city`,`notes`, `userName`, `password`, `isDeleted`, `createdTime` FROM `customers` WHERE `id`= ?;", [result.insertId], (err, result) => {
            if (err) {
                throw err;
            }

            res.send(result[0]);
        });
    });
}

export function updateCustomer(req, res) {
    con.query("UPDATE `customers` SET `fullName`=?,`phone`=?,`email`=?,`city`=?,`notes`=? WHERE `id` = ?;", [req.body.fullName, req.body.phone, req.body.email, req.body.city, req.body.notes, req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }

        res.send();

    });
}


export function removeCustomer(req, res) {
    con.query("UPDATE `customers` SET `isDeleted` = 1 WHERE `id` = ? ", [req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        }

        res.send();
    });
}