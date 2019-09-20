import { observable, action, decorate } from "mobx";

class UserModel {
  UserDistrict = null;
  UserGeolocationDisabled = false;
  UserGeolocationError = "";

  SetDistrict(val) {
    this.UserDistrict = val;
  }
  SetGeolocationDisabled(bool) {
    this.UserGeolocationDisabled = bool;
  }

  SetGeolocationError(err) {
    this.UserGeolocationError = err;
  }
}
decorate(UserModel, {
  UserDistrict: observable,
  SetDistrict: action,
  UserGeolocationDisabled: observable,
  SetGeolocationDisabled: action,
  UserGeolocationError: observable,
  SetGeolocationError: action,
});
const UserStore = new UserModel();
export default UserStore;
