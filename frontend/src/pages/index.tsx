import {FC} from "react";
import {HomeTemplate} from "../templates/HomeTemplate";
import {getRedirectComponent} from "../util/routing";

const HomePage: FC = () => {
  return <HomeTemplate />;
};

// export default HomePage;
export default getRedirectComponent(() => "/projects");
