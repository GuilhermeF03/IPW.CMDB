import express from "express";
import expressSession from "express-session";
import passport from "passport";

export default function (services) {
  const router = express.Router();

  router.use(
    expressSession({
      secret: "IPW 2023",
      resave: true,
      saveUninitialized: true,
    })
  );
  router.use(passport.initialize());
  router.use(passport.session());

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  router.get("/login", getLogin);
  router.get("/signup", getSignup);
  router.post("/signup", postSignup);
  router.post("/logout", postLogout);
  router.post("/login", postLogin);

  return router;

  function getLogin(req, resp) {
    resp.render("login",{title: "CMDB | LOG-IN", scripts:["showPass.mjs"]});
  }
  function getSignup(req,resp){
    resp.render("signup",{title: "CMDB | SIGN-UP", scripts:["showPass.mjs","validateSignup.mjs"]});
  }

  function postLogin(req, resp) {
    const username = req.body.username;
    const password = req.body.password;

    
    services
      .validateUser(username, password)
      .then((user) => login(req, user))
      .then(() => resp.redirect("/"))
      .catch(() => resp.status(401).send("Couldn't authenticate"));
  }

  function postSignup(req,resp){ // validation done in validateSignup.mjs
    const username = req.body.username;
    const password = req.body.password;
    services.createUser({username,password})
    .then((user) => login(req,user))
    .then(()=> resp.redirect("/login"))
  }

  function postLogout(req, resp) {
    req.logout(() => resp.redirect("/"));
  }

  function login(req, user) {
    //console.log(user);
    return new Promise((resolve, reject) => {
      req.login(user, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
}
