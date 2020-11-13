import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import NatsClient from '@/components/NatsClient.vue'

describe('NatsClient.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(NatsClient, {
      props: { msg }
    })
    expect(wrapper.text()).to.include(msg)
  })
})
