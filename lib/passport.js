const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models').User;

//pengaturan passport jwt
const options = {
    //ambil token dari request header dengan nama Authorization
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    //kunci rahasia ini harus sama dengan yang digunakan untuk membuat jwt di controller
    secretOrKey: '1a2b3c4d5e',
}

passport.use(new JwtStrategy(options, (payload, done) => {
    //disini isi jwt dibaca, isinya akan sama dengan isi ketika dibuat
    User.findByPk(payload.id)
    .then(user => done(null, user))
    .catch(err => done(err, false))
}))

module.exports = passport;