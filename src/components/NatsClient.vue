<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h1>NATS value: '{{ value }}'</h1>
    <div id="messages" class="container"></div>
  </div>
</template>

<script lang="ts">
import { connect, StringCodec, NatsConnection} from 'nats.ws'

const sc = StringCodec();

const testNats = async function () {
  const nc = await connect({ servers: 'ws://localhost:9222', user: 'jackonelli', pass: 'penna1glas'})
  nc.publish('ext_comm.ui.test', sc.encode('Init ui'));
}

testNats();

import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    msg: String
  }
})

export default class NatsClient extends Vue {
  msg!: string | null
  client!: NatsConnection
  value!: string

  created() {
    this.value = "-";
    console.log("Created");
    connect({ servers: 'ws://localhost:9222', user: 'jackonelli', pass: 'penna1glas'}).then((nc) => {
      this.client = nc;
      this.client.publish('ext_comm.ui.test', sc.encode('Created'));
      (async () => {
        const sub = this.client.subscribe("sensor.*.meas");
        for await (const msg of sub) {
          const val = sc.decode(msg.data);
          this.value = val;
          console.log("Rec");
        }
      })
      })
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
