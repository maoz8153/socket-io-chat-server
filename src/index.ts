import { NodeServer } from "./node-server";

let app = new NodeServer().getApp();
export { app };