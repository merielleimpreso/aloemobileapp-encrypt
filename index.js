#!/usr/bin/env node
const fs = require('fs');
const nodeRSA = require('node-rsa');
const program = require('commander');
const readline = require('readline');

program
.arguments('<file>')
.action(function(file) {
  // Use to read each lines of the file
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity
  });

  var publicKey = "";
  var lineCounter = 0;
  rl.on('line', (line) => {
    if (lineCounter > 0) {
      publicKey += "\n";
    }
    publicKey += line;
    lineCounter++;
  }).on('close', () => {
    // Use to prompt the user
    const ask = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    ask.question('Enter plain text: ', (plainText) => {
      const key = new nodeRSA(publicKey);
      key.setOptions({encryptionScheme: 'pkcs1'});

      const encryptedText = key.encrypt(plainText, 'base64');
      console.log("Encrypted text: %s", encryptedText);

      ask.close();
    });
  });
})
.parse(process.argv);
