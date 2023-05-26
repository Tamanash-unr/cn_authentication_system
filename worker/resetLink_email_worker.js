// Get Kue library and Reset Link Mailer
const queue = require('../config/kue');
const resetLinkMailer = require('../mailers/resetLink_mailer');

// Process jobs sent to queue (For Parallel Processing mutiple emails)
queue.process('emails', function(job, done){
    console.log('Emails worker is processing a job', job.data);

    resetLinkMailer.sendResetLink(job.data.user, job.data.token);
    done();
});