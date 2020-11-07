<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h1>{{ value }}</h1>
    <div id="messages" class="container"></div>
  </div>
</template>

<script lang="ts">
import { connect, StringCodec, NatsConnection, Subscription } from 'nats.ws'

// add an entry to the document
function addEntry(s: string) {
  const p = document.createElement("pre");
  p.appendChild(document.createTextNode(s));
  const messages = document.getElementById("messages");
  if(messages !== null) {
    messages.appendChild(p);
  }
}

const sc = StringCodec();

const createClient = function () {
  // create a connection
  return connect({ servers: 'ws://localhost:9222', user: 'jackonelli', pass: 'penna1glas'}).then((nc) => {
    return nc
  })
}

const init = async function () {
  // create a connection
  const nc = await connect({ servers: 'ws://localhost:9222', user: 'jackonelli', pass: 'penna1glas'})
  console.log('connected to NATS!');


  // simple publisher
  nc.publish('hello', sc.encode('nats'))
  console.log('published a message to `hello`');

  // simple subscriber, if the message has a reply subject
  // send a reply
  const sub = await nc.subscribe('help');
  (async () => {
    addEntry('listening for request on `help`');
    for await (const m of sub) {
      m.respond(sc.encode(`I can help ${sc.decode(m.data)}`));
    }
  })().then()

  // request data - requests only receive one message
  // to receive multiple messages, create a subscription
  addEntry('making a request to `help`');
  const msg = await nc.request('help', sc.encode('nats request'))

  addEntry(`got response '${sc.decode(msg.data)}'`);

  // close the connection
  nc.close();
  addEntry('closed the connection');
}
//init();

import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    msg: String
  }
})

export default class HelloWorld extends Vue {
  msg!: string | null
  client!: NatsConnection
  value!: string

  created() {
    connect({ servers: 'ws://localhost:9222', user: 'jackonelli', pass: 'penna1glas'}).then((nc) => {
      this.client = nc;
      (async () => {
        const sub = this.client.subscribe("sensor.meas");
        for await (const msg of sub) {
          const val = sc.decode(msg.data);
          this.value = val;
          console.log("Rec");
        }
      })
      })
  }

  testClient() {
    console.log(this.client);
    this.client.publish("Hello", sc.encode("Nats"));
  }

  mounted() {
    //setInterval(function () {
    //  this.testClient();
    //}.bind(this), 1000);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
