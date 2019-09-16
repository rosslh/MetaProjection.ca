import { observable, action, decorate } from "mobx";

class UserModel {
  UserDistrict = null;
  UserGeolocationDisabled = false;

  SetDistrict(val) {
    this.UserDistrict = val;
  }
  SetGeolocationDisabled(bool) {
    this.UserGeolocationDisabled = bool;
  }
}
decorate(UserModel, {
  UserDistrict: observable,
  SetDistrict: action,
  UserGeolocationDisabled: observable,
  SetGeolocationDisabled: action
});
const UserStore = new UserModel();
export default UserStore;
