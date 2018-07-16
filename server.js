const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
const app = express();
let counter = 0;

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;

  fs.appendFile('log.txt', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

app.use((req, res, next) => {
  counter += 1;
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs', {
//     pageTitle: 'We are having some issues right now',
//     maintenanceMessage: 'HEEEEEYYYYYY',
//   });
// })

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('home.hbs', {
    greeting: 'Welcome to Express!',
    pageTitle: 'Home Page',
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    helpText: 'About stuff',
    pageTitle: 'About Page',
  });
});

app.get('/requestCount', (req, res) => {
  res.render('requestCount.hbs', {
    numberOfRequests: counter,
    pageTitle: 'Request Counter',
  })
})

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'You suck dick.',
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});