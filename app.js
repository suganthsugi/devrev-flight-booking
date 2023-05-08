const express = require('express');
const app = express();
const mongodb = require('mongodb');
const mclient = mongodb.MongoClient;

const exhs = require('express-handlebars');
app.set('view engine', 'hbs');

app.set('views', 'views');
app.use(express.json());

const path = require('path');
const bodyParser = require('body-parser');
const { copyFileSync } = require('fs');
const { log } = require('console');
const { compile } = require('handlebars');

const path2 = path.join(__dirname, "../views")

app.use(express.static(path2));

app.use(bodyParser.urlencoded({ extended: true }));
let flight = ' ';
let database = '';
let username = ' ';
let timings = '';
let seat = ' ';
let user = '';
async function db() {
    let client = await mclient.connect('mongodb+srv://thambirajv20cse:SGbG7JkZB5HB8I9F@cluster0.t7tpv9j.mongodb.net/main?retryWrites=true&w=majority');
    if (client) {
        console.log('server connected');
    }
    else
        console.log('not connected');
    database = await client.db('Flight');
    flight = await database.collection('flight');
    timings = await database.collection('timings');
    username = await database.collection('username');
    seat = await database.collection('seat');
    user = await database.collection('user');
}

db();
app.get('/', (req, res) => {
    return res.render('search', { name: ' ', email: ' ' });
})
app.post('/from', async (req, res) => {
    const r = await timings.find({ id: req.body.id, travel: 'started' }).toArray();
    if (r.length != 0) {
        const l = [];
        for (var i = 0; i < r.length; i++) {
            l.push(r[i].date + r[i].time);
        }
        l.sort();
        //const h=date+time;   
        const t = l[l.length - 1];
        console.log(t);
        var u = '';
        console.log(r);
        for (var i = 0; i < 10; i++) {
            u += t.charAt(i);
        }
        const tk = await timings.findOne({ id: req.body.id, date: u });
        return res.send({ id: tk.to });
    }
    else
        return res.send({ id: '' });
})

// signup details
app.post('/form', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.password;
    const pass1 = req.body.confirmpassword;
    const r = name + '[' + email;
    const dv = await user.findOne({ name: r });
    if (r.endsWith('.edu') || r.endsWith('.in')) {
        return res.render('signup', { msg: 'use personal mails' });
    }
    else if (dv != null) {
        return res.render('signup', { msg: 'mail is already taken' });
    }
    else if (pass.localeCompare(pass1) != 0) {
        return res.render('signup', { msg: 'please check the password' });
    }
    else {
        var sp = '!@#$%^&*'
        var no = '1234567890'
        var sm = 'qwertyuiopasdfghjklmnbvcxz';
        var up = 'QWERTYUIOPASDFGHJKLMNBVCXZ';
        var sp1 = 0;
        var no1 = 0;
        var sm1 = 0;
        var up1 = 0;
        for (var i = 0; i < pass1.length; i++) {
            if (sp.includes(pass1.charAt(i) + '')) {
                sp1++;
            }
            else if (no.includes(pass1.charAt(i) + '')) {
                no1++;
            }
            else if (sm.includes(pass1.charAt(i) + '')) {
                sm1++;
            }
            else if (up.includes(pass1.charAt(i) + '')) {
                up1++;
            }
        }
        if (sp1 >= 1 && no >= 1 && sm1 >= 1 && up1 >= 1) {

            await user.insertOne({ id: r, password: pass, usertype: 'cus', email: email, name: name, bookings: [] });
        }
        else {
            return res.render('signup', { msg: 'password consits of one UPPERCSE,LOWERCSE,SPECIAL CH,NUMBER' })
        }
    }
    return res.render('login', { msg: 'succesfully saved', pk: '' });
})
// login details

app.post('/logindata', async (req, res) => {
    const name = req.body.username;
    const pass = req.body.password;
    var k = '';

    const ch = await user.findOne({ name: name, password: pass });
    if (ch != null) {
        k = await user.findOne({ name: name });
        let r = k.email;
        
        var today=new Date();
        // Get the year, month, and day of the month from the Date object
        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);
        var dateString = year + '-' + month + '-' + day;
        console.log(name + dateString);
        var now = new Date();

        // Get the current hour and minute from the Date object
        var hour = ('0' + now.getHours()).slice(-2);
        var minute = ('0' + now.getMinutes()).slice(-2);

        // Combine the hour and minute into a string in the format "HH:MM"
        var timeString = hour + ':' + minute;

        // Output the time string
        const y=dateString+timeString;
        console.log(dateString+"[][");
        const y1=await timings.find({date:dateString}).toArray();
        var l='';
        for(var i=0;i<y1.length;i++){
            const r=await flight.findOne({id:y1[i].id});
            l+=r.name+','+dateString+','+y1[i].time+','+','+y1[i].from+','+y1[i].to+','+y1[i].duration+','+y1[i].stop+','+y1[i].end+','+y1[i].price+']';
          
        }  
         console.log(l)
       return res.render('search', { name: name, email: r ,l:l});
    }
    const y = await user.findOne({ email: name, password: pass });
    if (y != null) {
        let o = '';
        if (name.endsWith('@gmail.com')) {
            let r = await user.findOne({ email: name });
            o = r.name;
            var today = new Date();

            // Get the year, month, and day of the month from the Date object
            var year = today.getFullYear();
            var month = ('0' + (today.getMonth() + 1)).slice(-2);
            var day = ('0' + today.getDate()).slice(-2);
            var dateString = year + '-' + month + '-' + day;
            console.log(name + dateString);
            var now = new Date();

            // Get the current hour and minute from the Date object
            var hour = ('0' + now.getHours()).slice(-2);
            var minute = ('0' + now.getMinutes()).slice(-2);

            // Combine the hour and minute into a string in the format "HH:MM"
            var timeString = hour + ':' + minute;

            // Output the time string
            const y=dateString+timeString;
            console.log(dateString+" "+y);
            const y1=await timings.find({date:dateString}).toArray();
            var l='';
            for(var i=0;i<y1.length;i++){
                const r=await flight.findOne({id:y1[i].id});
                l+=r.name+','+dateString+','+y1[i].time+','+y1[i].from+','+y1[i].to+','+y1[i].duration+','+y1[i].stop+','+y1[i].end+','+y1[i].price+']';
              
            }  
            console.log(l);
            return res.render('search', { name: o, email: name,l:l })
        }
    }
    return res.render('login', { msg: 'invalid UserName/Password ' });
})
app.get('/login', async (req, res) => {
    console.log('comes under')
    return res.render('login');
})

//admin login page
app.get('/admin', (req, res) => {
    console.log('opp')
    return res.render('adminlogin');
})
app.get('/time', async (req, res) => {
    return res.render('signup')
})
app.post('/addflight', async (req, res) => {
    const name = req.body.name;
    const id = req.body.id;
    const time = req.body.timings;
    const date = req.body.date;
    const from = req.body.from;
    const to = req.body.to;
    const price = req.body.price;
    const duration = req.body.duration;
    const stop = req.body.stop;
    const end = req.body.end;
    const endd = req.body.endd;
    const r = endd + '[' + end;
    const t = await flight.findOne({ id: id, name: name, from: from, to: to });
    console.log(req.body);
    if (t == null) {
        flight.insertOne({ id: id, name: name, from: from, to: to, price: req.body.price, duration: duration, end: r, stop: stop });
    }
    var str = name + date + time;
    timings.insertOne({ id: id, from: from, to: to, date: date, time: time, travel: 'started', idk: str, duration: duration, price: price, end: r, stop: stop });
    return res.render('flighttime', { msg: 'flight was added' })
})

app.post('/admincheck', async (req, res) => {
    const u = await user.findOne({ usertype: 'ad', name: req.body.username, password: req.body.password });
    if (u != null) {
        return res.render('flighttime');
    }
    return res.render('adminlogin', { msg: 'invalid username or passworrd' })
})
app.post('/time', async (req, res) => {
    const r = await timings.find({ id: req.body.id }).toArray();
    if (r.length != 0) {
        const l = [];
        for (var i = 0; i < r.length; i++) {
            l.push(r[i].date + r[i].time);
        }
        l.sort();
        //const h=date+time;   
        const t = l[l.length - 1];
        console.log(t);
        var u = '';
        console.log(r);
        for (var i = 0; i < 10; i++) {
            u += t.charAt(i);
        }
        var d = '';
        for (var i = 10; i < 15; i++) {
            d += t.charAt(i);
        }
        return res.send({ date: u, time: d });
    }
    else {
        return res.send({ date: '0-0-0', timee: '00.00' });
    }
})

app.get('/search', async (req, res) => {
    const rt = await timings.find({}).toArray();
    var rp = new Date();
    console.log(rp);
    return res.render('search');
})

//search based on time and date;
app.post('/search', async (req, res) => {
    const t = await timings.find({}).toArray()
    const r0 = req.body.time;
    const r1 = req.body.date;
    const check = r1 + r0;
    const l = [];
    for (var i = 0; i < t.length; i++) {
        var a = t[i].date 
        console.log(a+" "+check);
        if (a.localeCompare(r1) == 0 && t[i].travel.localeCompare('cancelled') != 0) {
            console.log('ppppp');
            const r = await flight.findOne({ id: t[i].id, from: t[i].from, to: t[i].to });

            l.push(r.name + ',' + t[i].date + ',' + t[i].time + ',' + t[i].from + ',' + t[i].to + ',' + r.duration + ',' + r.stop + ',' + t[i].end + ',' + r.price);
        }
    }
    console.log('[['+l);
    return res.send({ val: l });
})

app.get('/bookseat', async (req, res) => {
    console.log(req.query);
    //  console.log(req.query.e.localeCompare('thambi2023-05-0810.20'));
    const r = await seat.findOne({ name: String(req.query.e) });
    var fillseat = '';
    if (r != null) {
        const arr = r.seatno;
        for (var i = 0; i < arr.length; i++) {
            fillseat += arr[i] + 'f';
        }
    }
    else {
        fillseat += '';
    }
    console.log('pp' + fillseat)
    return res.render('book', { e: req.query.e, fillseat: fillseat });
})



app.get('/fillseat', async (req, res) => {
    const rt = req.query.id;
    const name = req.query.name.trim();
    const t = await seat.findOne({ name: name });
    const seatno = req.query.fillseat;
    console.log(fillseat);
    var seat1 = seatno.split('.');
    console.log(t);
    var arr = [];
    var plac1 = rt.split(']');
    var plac = plac1.join('[');
    for (var i = 0; i < seat1.length - 1; i++) {
        arr.push(seat1[i]);
    }
    const ert = await timings.findOne({ idk: name })
    const na = ert.id;
    const gu = await flight.findOne({ id: na });
    const nb = gu.name;
    const fro = ert.from;
    const top = ert.to;
    const tot = arr.length;
    const str = nb + '[' + fro + '[' + top + '[' + tot;
    var ti = [];
    ti.push(str);
    if (t == null) {
        await seat.insertOne({ name: name, seat: 60, seatno: arr });
        await user.updateOne({ id: plac }, { $push: { bookings: { $each: ti } } })
    }
    else {

        await seat.updateOne({ name: name }, { $push: { seatno: { $each: arr } } });
        await user.updateOne({ id: plac }, { $push: { bookings: { $each: ti } } });

    }

    const r = await seat.findOne({ name: name });
    const arr1 = r.seatno;
    var fillseat = '';
    for (var i = 0; i < arr1.length; i++) {
        fillseat += arr1[i] + 'f';
    }
    console.log('correct' + fillseat);
    return res.render('book', { msg: 'successfully booked', fillseat: fillseat, e: name })
})


app.post('/seatcheck', async (req, res) => {
    const arr = await timings.find({ id: req.body.id.trim() }).toArray();
    var res = [];
    var res1 = [];
    var head = '';
    for (var i = 0; i < arr.length; i++) {
        const q = await flight.findOne({ id: req.body.id });
        if (q != null) {
            head = q.name;
            var a = q.name + arr[i].date + arr[i].time;
            res.push(a);
            const t = await database.collection('seat').findOne({ name: a.trim() });
            if (t != null) {
                var seat12 = t.seatno;
                seat12 = new Set(seat12);
                seat12 = Array.from(seat12);
                res1.push(seat12.length);
            }
            else {
                res1.push(0);
            }
        }
        else {
            res.push('not found');
        }
    }
    ;
    console.log(res);
    return res.send({ res: '1', res1: '2' });
})

app.post('/seatno', async (req, res) => {
    const r = await seat.findOne({ name: req.body.time });
    var fillseat = '';
    if (r != null) {
        const arr1 = r.seatno;
        for (var i = 0; i < arr1.length; i++) {
            fillseat += arr1[i] + 'f';
        }
        console.log(fillseat);
    }
    else
        fillseat += '';
    return res.send({ fillseat: fillseat });
})


//this function to show available of seats in flight..
app.post('/fk', async (req, res) => {
    const r = req.body.id;
    const aw = await flight.findOne({ id: r.trim() });
    let res2 = [];
    let res1 = [];
    if (aw != null) {
        const name = aw.name;
        const ar = await timings.find({ id: r }).toArray();
        var str = '';
        var seatvalu = '';
        for (var i = 0; i < ar.length; i++) {
            str = name + ar[i].date + ar[i].time;
            console.log(str);
            var sk = name + ',' + ar[i].date + ',' + ar[i].time + ',' + ar[i].from + ',' + ar[i].to;
            const t = await seat.findOne({ name: str });
            if (t != null) {
                let u = t.seatno;
                var c = 0;
                for (var i = 0; i < u.length; i++) {
                    if (u[i].localeCompare("0") == 0 || u[i].localeCompare(" ") == 0) {
                    }
                    else {
                        c++;
                    }
                }
                res2.push(sk);
                res1.push(c);
            }
            else {
                res2.push(sk);
                res1.push("0");
            }
        }
    }
    return res.send({ res: res2, res1: res1 });
})

app.post('/flightch', async (req, res) => {
    //console.log(req.body);
    const y = await timings.find({ id: req.body.id,travel:'started'}).toArray();
    var rk = []
    if (y.length != 0) {
        const y1 = await flight.findOne({ id: req.body.id });
        const name = y1.name;
        for (var i = 0; i < y.length; i++) {
            var str = name + y[i].date + y[i].time;
            var sen = name + ',' + y[i].from + ',' + y[i].to + ',' + y[i].date + ',' + y[i].time;
            rk.push(sen);   
        }
    }
    return res.send({ rk: rk });
})

app.get('/cancel', async (req, res) => {
    var r = req.query.name.split(']');
    console.log(r[0]);
    const y = await flight.findOne({ id: String(r[0]) });
    console.log(y);
    var name = '';
    if (y != null) {
        name = y.name;
    }
    else {
        return res.render('flighttime');
    }
    console.log(r[1]);
    var date1 = new Date(r[1]);
    console.log(date1)
    const u = await timings.find({ id: r[0] }).toArray();
    for (var i = 0; i < u.length; i++) {
        const r = new Date(u[i].date)
        if (r >= date1) {
            console.log(u[i]);
            await timings.updateOne({ id: u[i].id, time: u[i].time, date: u[i].date }, { $set: { 'travel': 'cancelled' } });
            console.log(u[i]);
        }
    }
    return res.render('flighttime',{ msg: 'succesfully cancelled' })
})

app.get('/mybook', async (req, res) => {
    const y = req.query.id;
    console.log(y);
    const r = await user.findOne({ id: y });
    var t = r.bookings;
    var name = [];
    var from = '';
    var to = '';
    var seatop = '';
    for (var i = t.length - 1; i > 0; i--) {
        var yl = t[i].split('[');
        name += (yl[0]) + '.';
        from += (yl[1]) + '.';
        to += (yl[2]) + '.';
        seatop += (yl[3]) + '.';
    }
    return res.render('lastbook', { name: name, from: from, to: to, seat: seatop });
})

app.post('/getname', async (req, res) => {
    const op = await flight.findOne({ id: req.body.id });
    if (op == null) {
        return res.send({ rk: ' ' });
    }
    return res.send({ rk: op.name });
})


app.listen(7000);