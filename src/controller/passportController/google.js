import passport from "passport";
import passportGoogle from "passport-google-oauth";
import UserModel from "./../../model/userModel";
import {transError, transSuccess} from "./../../../lang/vi";

let GoogleStrategy = passportGoogle.OAuth2Strategy;

/**
 * Kiểm tra account type: Google
 */
let initPassportGoogle = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GG_APP_ID,
    clientSecret: process.env.GG_APP_SECRET,
    callbackURL: process.env.GG_CALLBACK_URL,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findByGoogleUid(profile.id);

      if (user) {
        return done(null, user, req.flash("success", transSuccess.login_success(user.username)));
      }
      let newUserItem = {
        username: profile.displayName,
        gender: profile.gender,
        local: {isActive: true},
        google: {
          uid: profile.id,
          token: accessToken,
          email: profile.emails[0].value
        }
      };
      let newUser = await UserModel.createNew(newUserItem);

      return done(null, newUser, req.flash("success", transSuccess.login_success(newUser.username)));
    } catch (error) {
      console.log(error);
      return done(null, false, req.flash("errors", transError.server_error));
    }
  }));

  // Lưu user id vào session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Được gọi bởi passport.session()
  // return userInfo gán vào req.user 
  passport.deserializeUser((id, done) => {
    UserModel.findUserByIdForSession(id)
      .then(user => {
        return done(null, user);
      })
      .catch(error => {
        return done(error, null);
      })
  });
};

module.exports = initPassportGoogle;
