const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  // geralmente o parametro user recebe o id que você pode usar pra buscar no proprio
  // banco e retornar o user no callback(done)
  // ps: você pode acessar isso depois em req.user
  done(null, user)
})

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3333/auth/google/callback"
  },
  function (acessToken, refreshToken, profile, done){
    // profile(profile.id por exemplo) pode ser usado pra cadastrar esse user no seu banco
    // como não é o caso, pode passar ele no callback
    return done(null, profile)
  }
))
