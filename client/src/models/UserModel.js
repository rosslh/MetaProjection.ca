import { makeObservable, observable, action } from "mobx";

class UserModel {
  UserDistrict = null;
  UserGeolocationDisabled = false;
  UserGeolocationError = "";

  constructor() {
    makeObservable(this, {
      UserDistrict: observable,
      SetDistrict: action,
      UserGeolocationDisabled: observable,
      SetGeolocationDisabled: action,
      UserGeolocationError: observable,
      SetGeolocationError: action,
    });
  }

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

const UserStore = new UserModel();
export default UserStore;
