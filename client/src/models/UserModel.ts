import { makeObservable, observable, action } from "mobx";

class UserModel {
  UserDistrict: number | null = null;
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

  SetDistrict(val: number) {
    this.UserDistrict = val;
  }

  SetGeolocationDisabled(bool: boolean) {
    this.UserGeolocationDisabled = bool;
  }

  SetGeolocationError(err: string) {
    this.UserGeolocationError = err;
  }
}

const UserStore = new UserModel();
export default UserStore;
