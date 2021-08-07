# Accio

- As technology advances, we will require more servers to operate our web applications. It's acceptable to remember one server cred, but remembering thousands isn't
- We present [Accio](https://accio.fabianferno.tech) to you,  a web app that allows you to save and share thousands of server credentials with a single click. There's no need to be concerned about data leaks because the credentials are encrypted.

## How do you use

- With our minimal UI, using Accio is a piece of cake. You can choose your mode of login either via email-passwsord/SSO
- After logging in, you'll be prompted to provide your server credentials in input fields
- Fill them, click submit and voila! Your cred is saved, easy-peasy right

## Editing & sharing

### Uh oh! I entered a wrong ssh passoword<br/>
<img src="https://countdown-liard.vercel.app/images/ss2.png" height="=300px" width="300px" /> <br/>
- No worries, see the edit icon at top right of the card, click it
- Edit them in the input fields, click submit and... done

### I feel like sharing my creds to a co developer<br/>
<img src="https://countdown-liard.vercel.app/images/ss1.png" height="=300px" width="300px" /> <br/>
- We got you, See the share icon at top right of the card, click it
- Provide the recipient's email and name, click submit and... done

### This server cred is Reduntant<br/>
<img src="https://countdown-liard.vercel.app/images/ss3.png" height="=300px" width="300px" /> <br/>
- As developers we know redundance is inevitable
- Click the delete icon and the creds will be removed

## Services that we used

### Supabase
- Spabase was our go to build this app
- It automatically creates a database record, which is super cool!
- We can also create database rules
- Working with database is much easier
- It also automatically generates boilerplat, which made out job easy

For the [backend](https://github.com/fabianferno/accio-be) - Flask, Supabase <br/>
For the frontend - ReactJs
