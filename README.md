# cn_authentication_system
A complete Authentication System which can be used as a starter code for creating any new application

System Requirements:
- Node JS v10 or higher
- Mongo DB
- Redis Server

Steps to Setup:
- Clone this repository and run 'npm install'
- Setup these environment variables :
![env_vars](https://github.com/Tamanash-unr/cn_authentication_system/assets/78737123/66e95b81-c127-45b8-a978-b5e0c1a2e519)
- To check if the environment variables have been setup correctly, run 'node' in your cmd/terminal and type 'process.env'. If these vars are showing in the result then they have been setup successfully.
- After all these steps, run 'node index.js' in your cmd/terminal, if you have nodemon installed you can also run this using 'npm start'

Google Sign In:
- First, you’ll need to create a [Google Cloud project](https://www.console.cloud.google.com).
- You can follow [this guide](https://medium.com/nerd-for-tech/google-oauth2-0-authentication-using-node-js-and-passportjs-1a77f42b1111) to setup your OAuth Credentials.
- Once you receive your Client ID, Client Secret and Callback URL; enter them in the environment variables created before.
