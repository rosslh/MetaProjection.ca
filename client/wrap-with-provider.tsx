import React from "react";
import { Provider } from "mobx-react";
import UserStore from "./src/models/UserModel";

// eslint-disable-next-line react/display-name,react/prop-types
export default ({ element }) => (
  <Provider store={UserStore}>{element}</Provider>
);
