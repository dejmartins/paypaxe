import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '../../user/model/user.model';
import config from '../../../../config/default';

passport.use(new GoogleStrategy({
  clientID: config.googleClientID,
  clientSecret: config.googleClientSecret,
  callbackURL: '/api/auth/google/callback',
},
async (token, tokenSecret, profile, done) => {
  try {
    // @ts-ignore
    const email = profile.emails[0].value;
    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        email,
        name: profile.displayName,
        verified: true,
      });
      return done(null, { user, isNewUser: true });
    }

    return done(null, { user, isNewUser: false });
  } catch (error) {
    return done(error, false);
  }
}));

passport.serializeUser((data, done) => {
  done(null, data);
});

passport.deserializeUser(async (data, done) => {
  try {
    // @ts-ignore
    const user = await UserModel.findById(data.user._id);
    // @ts-ignore
    done(null, { user, isNewUser: data.isNewUser });
  } catch (error) {
    done(error, null);
  }
});

export default passport;
