const express = require('express');

const router = express.Router();
const fs = require('fs');
const path = require('path');
const { socket } = require('../socket/socket.js');

/* GET home page. */
router.get('/', (req, res) => {
  const imgExist = fs.existsSync(path.join(__dirname, '../../image.png'));
  const mdlExist = fs.existsSync(path.join(__dirname, '../../best.pt'));
  const run = imgExist && mdlExist;
  return res.render('home', {
    imgExist,
    mdlExist,
    run,
  });
});

router.post('/run-model', (req, res) => {
  socket.emit('predict', 'Please predict for me');

  res.render('predict');
});

module.exports = router;
