import passport from 'passport';
import { ExtractJwt as ExtractJWT, Strategy as JwtStrategy } from "passport-jwt";
import { jwtSecret } from "./config.js";

const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
};

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
    try {
        if (jwt_payload) {
            return next(null, jwt_payload);
        } else {
            return next(null, false);
        }
    } catch (error) {
        console.error('Error en el middleware de Passport JWT:', error);
        return next(error, false);
    }
});

passport.use(strategy);

export default passport;