// import the connect function
import { connect, StringCodec } from "./node_modules/nats.ws/nats.mjs";

// to create a connection to a nats-server:
const nc = await connect({ servers: 'ws://localhost:9222', user: 'jackonelli', pass: 'penna1glas'});

// create a codec
const sc = StringCodec();
// create a simple subscriber and iterate over messages
// matching the subscription

nc.publish("sensor.meas", sc.encode("temp"));

nc.close();
