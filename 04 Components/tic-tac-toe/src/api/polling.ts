import { onMounted, onUnmounted } from 'vue'

export default function(doPoll: () => Promise<boolean>) {
  let active = true

  async function poll() {
    if (!active) return
    const recurse = await doPoll()
    if (recurse) setTimeout(poll, 250)
  }

  onMounted(() => {
    active = true
    poll()
  })

  onUnmounted(() => {
    active = false
  })
}
