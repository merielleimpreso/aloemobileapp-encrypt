#!/usr/bin/env node
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
var nodeRSA = require('node-rsa');
var publicKey = require('./keys/public_key');

program
.action(function() {
  co(function *() {
    var loop = true;

    while (loop) {
      var plaintext = yield prompt('\nEnter plain text: ');

      const key = new nodeRSA(publicKey.key);
      key.setOptions({encryptionScheme: 'pkcs1'});

      // Encrypt the plaintext using RSA
      const encryptedText = key.encrypt(plaintext, 'base64');
      console.log("Encrypted text: %s", encryptedText);

      var shouldContinue = yield prompt('\nEnter y to repeat, any key to exit: ');
      if (shouldContinue != 'Y' && shouldContinue != 'y') {
        loop = false;
        process.exit(0);
      }
    }
  });
})
.parse(process.argv);;
