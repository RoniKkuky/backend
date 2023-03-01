import { con } from '../sqlConnect';


export function signup(req, res) {
    const sqlQuery = "INSERT INTO `customers`(`createdTime`, `fullName`,`phone`,`city`, `email`, `userName`, `password`) VALUES (CURRENT_TIME, ?,?, ?,?, ?, MD5(?))";
    const paramArr = [req.body.fullName, req.body.phone, req.body.city, req.body.email, req.body.userName.trim(), req.body.password];

    con.query(sqlQuery, paramArr, (err, result) => {
        if (err) {
            throw err;
        }

        con.query("SELECT `id`, `fullName`, `phone`, `email`, `city`, `userName`, `password`, `isDeleted`, `createdTime` FROM `customers` WHERE `id`= ?;", [result.insertId], (err, result) => {
            if (err) {
                throw err;
            }

            res.send(result[0]);
        });
    });
}