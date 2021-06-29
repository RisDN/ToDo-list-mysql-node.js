const express = require('express')
const mysql = require('mysql')
const app = express()

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }));
app.listen(3000)

// Főoldal, index megjelenítése
app.get('/', (req, res) => {
    res.render('index.ejs')
});

// Lista megjelenítése, adat továbbítása
app.get('/lista', (req, res) => {
    let sqlparancs = 'SELECT * FROM feladatok'
    let lekerdezes = db.query(sqlparancs, (err, results) => {
        if (err) { throw err }
        res.render('lista.ejs', { adat: results });
    })
});

// Létrehozás gomb kérés
app.post('/letrehozas', (req, res) => {
    let adat = {
        szoveg: req.body.szoveg,
        keszenvan: 'Nem'
    }
    let sqlparancs = 'INSERT INTO feladatok SET ?'
    let futtatas = db.query(sqlparancs, adat, err => {
        if (err) { throw err }
    });
    res.redirect('letrehozas')
});

// Létrehozás megjelenítése
app.get('/letrehozas', (req, res) => {
    res.render('letrehozas.ejs')
});

// Feladat törlése
app.post('/torles', (req, res) => {
    console.log(req.body.torles)
    let sqlparancs = `DELETE FROM feladatok WHERE Azonosito = ${req.body.torles}`
    let futtatas = db.query(sqlparancs, err => {
        if (err) { throw err }
    });
    res.redirect('lista')
});

// Állapot változtatás kérés fogadása
app.post('/kesz', (req, res) => {
    let sqlparancs = `SELECT * FROM feladatok WHERE Azonosito = ${req.body.kesz}`
    let lekerdezes = db.query(sqlparancs, (err, results) => {
        if (err) { throw err }
        if (results[0].Keszenvan == 'Igen') {
            let sqlparancs = `UPDATE feladatok SET Keszenvan = 'Nem' WHERE Azonosito = ${req.body.kesz};`
            let futtatas = db.query(sqlparancs, err => {
                if (err) { throw err }
            });
        } else if (results[0].Keszenvan == 'Nem') {
            let sqlparancs = `UPDATE feladatok SET Keszenvan = 'Igen' WHERE Azonosito = ${req.body.kesz};`
            let futtatas = db.query(sqlparancs, err => {
                if (err) { throw err }
            });
        }
    })
    res.redirect('lista')
});

// Kapcsolat létrehozása a MySQL-hez
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'feladatok'
});
// Kapcsolódás a MySQL-hez
db.connect(err => {
    if (err) { throw err }
    console.log('MySQL kapcsolat létrehozva')
});