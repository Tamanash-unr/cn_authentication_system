const queue = require('../config/kue');
const resetLinkMailer = require('../mailers/resetLink_mailer');

queue.process('emails', function(job, done){
    console.log('Emails worker is processing a job', job.data);

    resetLinkMailer.sendResetLink(job.data.user, job.data.token);
    done();
});