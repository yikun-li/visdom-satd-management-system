import {NextApiRequest, NextApiResponse} from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";

const TARGET = process.env.BACKEND_HOST;

export async function backendProxy(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    await httpProxyMiddleware(req, res, {target: TARGET});
  } catch (err) {
    console.error("Proxy error", err);
  }
}
