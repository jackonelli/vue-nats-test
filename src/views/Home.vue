<template>
  <div class="home">
    <NatsClient msg="Nats client test"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NatsClient from '@/components/NatsClient.vue'; // @ is an alias to /src

@Options({
  components: {
    NatsClient,
  },
})
export default class Home extends Vue {}
</script>
