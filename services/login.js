import { con } from '../sqlConnect';

// פונקציה לקבלת סטטוס החיבור של היוזר
export function getLoginStatus(req, res) {
    if (req.session.user) {
        res.send({
            status: 'success',
            user: req.session.user,
        });
    } else {
        res.send({
            status: 'error',
        });
    }
}

export function logout(req, res) {


    delete req.session.user;
    res.send();
}





export function googleLogin(req, res) {

    // (אימות מול גוגל)

    con.query("SELECT * FROM `users` WHERE `email`=?", [req.body.email], (err, result) => {
        if (err) {
            console.log(err);

            res.send({
                status: 'error',
                message: 'unidentified error'
            });

            return;
        }

        if (!result.length) {
            const sqlQuery = "INSERT INTO `users`(`createdTime`, `fullName`, `email`, `userName`, `password`) VALUES (CURRENT_TIME, ?, ?, ?, '')";
            const paramArr = [req.body.name, req.body.email, ''];

            con.query(sqlQuery, paramArr, (err, result) => {
                if (err) {
                    throw err;
                }

                con.query("SELECT `id`, `createdTime`, `fullName`, `email`, `userName` FROM `users` WHERE `id` = ?", [result.insertId], (err, result) => {
                    if (err) {
                        throw err;
                    }

                    const user = result[0];
                    req.session.user = user;

                    res.send({
                        status: 'success',
                        user,
                    });
                });
            });
        } else {
            const user = result[0];
            req.session.user = user;

            res.send({
                status: 'success',
                user,
            });
        }
    });
}











export function login(req, res) {
    delete req.session.user;
    if (!req.session.attempts) {
        req.session.attempts = 0;
    }

    if (req.session.attempts >= 7) {
        res.send({
            status: 'error',
            message: "נסיונות חיבור מרובים",
        });

        return;
    }

    const sqlQuery = "SELECT * FROM `customers` WHERE `userName`=? AND `password`=MD5(?)";

    const paramArr = [req.body.userName.trim(), req.body.password.trim()];

    con.query(sqlQuery, paramArr, (err, result) => {


        if (err) {
            console.log(err);

            req.session.attempts++;

            res.send({
                status: 'error',
                message: "שגיאה לא מוגדרת",
            });

            return;
        }

        if (!result.length) {
            req.session.attempts++;

            res.send({
                status: 'error',
                message: "שם משתמש או סיסמה לא נכונים",
            });
        } else {

            delete req.session.attempts;

            const user = result[0];
            req.session.user = user;

            res.send({
                status: 'success',
                user,
            });
        }
    });
}