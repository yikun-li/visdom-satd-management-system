import * as path from "path";
import {getRedirectComponent} from "../../../../util/routing";

export default getRedirectComponent((prev) => path.join(prev, ".."));
