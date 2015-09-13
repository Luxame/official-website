var express = require('express');
var router = express.Router();
var util = require('util');
var ejs = require('ejs');
var fs = require('fs');

var mandrill = require('mandrill-api/mandrill');
var mandrillClient = new mandrill.Mandrill('zc_TYYw-xDDLYu_lJbNqBQ');

/* POST contact mail. */
router.post('/', function(req, res) {

	var contactName = req.body.name || 'NO_NAME',
		contactEmail = req.body.email || 'NO_EMAIL',
		contactSubject = req.body.subject || 'NO_SUBJECT',
		contactMessage = req.body.message || 'NO_MWSSAGE';

	var mailContent = fs.readFileSync(__dirname + '/../mailTemplates/contact.html').toString();
	var mailConfirmation = fs.readFileSync(__dirname + '/../mailTemplates/confirmation.html').toString();

	var message = {
		html: util.format(mailContent, contactName, contactEmail, contactSubject, contactMessage),
		subject: '[CONTACT] contactSubject',
		from_email: contactEmail,
		from_name: contactName,
		to: [{
			email: 'kyle@trunk-studio.com',
			type: 'to'
		}, {
            email: 'smlsun@trunk-studio.com',
            type: 'to'
        }]
	};

	var messageConfirmation = {
		html: util.format(mailConfirmation, contactName, contactSubject, contactMessage),
		subject: 'Re: ',
		from_email: 'support@trunk-studio.com',
		from_name: '',
		to: [{
			email: contactEmail,
			type: 'to'
		}, {
			email: 'kyle@trunk-studio.com',
		    type: 'bcc'
		}, {
			email: 'smlsun@trunk-studio.com',
			type: 'bcc'
		}]
	};

	mandrillClient.messages.send({ 'message': message }, 
		function (result) {
			console.log(result);
			mandrillClient.messages.send({ 'message': messageConfirmation }, 
				function (result) {
					console.log(result);
					res.redirect('/');
					return;
				},
				function (err){
					console.log('err');
					console.log(err);
					res.redirect('/');
					return;
				}
			);
			return;
		},
		function (err){
			console.log('err');
			console.log(err);
			res.redirect('/');
			return;
		}
	);
});

module.exports = router;
