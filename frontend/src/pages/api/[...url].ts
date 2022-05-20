import {NextApiHandler} from "next";
import {backendProxy} from "../../backend/remote/proxy";

const handler: NextApiHandler = (req, res) => backendProxy(req, res);

export default handler;
