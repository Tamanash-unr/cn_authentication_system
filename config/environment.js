const development = {
    name: 'development',
    asset_path: '/public', // Path where all the static files are kept
    session_cookie_key: process.env.AUTHSYS_SESSION_COOKIE_KEY, // Key for creating User session
    db: 'auth_system',  // Database Name
    client_url:process.env.AUTHSYS_CLIENT_URL, // Base URL
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.AUTHSYS_SMTP_AUTH_USER,   // SMTP Auth User - user account used to send mail
            pass: process.env.AUTHSYS_SMTP_AUTH_PASS    // SMTP Auth Password
        }
    },
    google_clientID: process.env.AUTHSYS_GOOGLE_CLIENT_ID,    
    google_clientSecret: process.env.AUTHSYS_GOOGLE_CLIENT_SECRET,
    google_callbackURL: process.env.AUTHSYS_GOOGLE_CALLBACK_URL,
    jwt_secretKey: process.env.AUTHSYS_JWT_SECRET_KEY
}

module.exports = development;