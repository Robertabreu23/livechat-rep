import {io} from "socket.io-client";

const URL = process.env.NODE_ENV === "production"
  ? process.env.REACT_APP_SERVER_URL
  : "http://localhost:3001";

const socket = io(URL, { autoConnect: false });
export default socket;