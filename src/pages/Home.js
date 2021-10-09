import { Provider } from "react-redux";
import MainNavigation from "../components/home/Header/MainNavigation";

import { store } from "../store";
export default function Home() {
  return (
    <div>
      <Provider store={store}>
        <MainNavigation />
      </Provider>
    </div>
  );
}
