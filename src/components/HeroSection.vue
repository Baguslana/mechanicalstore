<script setup>
import { onMounted, ref } from 'vue'

const heroRef = ref(null)

onMounted(() => {
  setTimeout(() => {
    const animatedElements = heroRef.value?.querySelectorAll('.animate-on-load')
    animatedElements?.forEach((el) => {
      el.style.opacity = '1'
    })
  }, 100)
})
</script>

<template>
  <div
    ref="heroRef"
    class="relative flex flex-col items-center justify-center text-center p-8 md:p-16 rounded-xl min-h-[480px] bg-cover bg-center overflow-hidden"
    style="
      background-image:
        linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2)),
        url('https://lh3.googleusercontent.com/aida-public/AB6AXuC7dP4nKBU211j4ojSFQYJr3ek0n-vkQlT-1JoMub_s22JhWRI3NmPfTetKyFwQ8_NI1BZ1ff7RGFfaa9YXnsC9oaunY_c77ZdYyCKkDWVudBYZ7YooY-FJTFbAIlsz37QhntVtnpG6CLmIB-zbnGabxdScPvFaCjkIHf3iqrTs_rSTwgQOQTS2eN89CMqrFlYhLdEIAILF5fFnbPXoTYeeHOMVAgfxK6-5i7TpMM_wAu6xDiUl-i61-uF9t2mhfXMjQJy6aZ7KHeE');
    "
  >
    <div class="absolute inset-0 bg-black/30 z-0"></div>
    <div class="max-w-2xl text-white z-10">
      <h1
        class="text-4xl md:text-6xl font-bold tracking-tighter mb-4 animate-on-load animate-fade-in-up"
        style="animation-delay: 0.2s; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5)"
      >
        Elevate Your Typing Experience
      </h1>
      <p
        class="text-base md:text-lg text-stone-200 mb-8 animate-on-load animate-fade-in-up"
        style="animation-delay: 0.4s; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5)"
      >
        Discover our premium selection of mechanical keyboard switches and keycaps, designed for
        enthusiasts and professionals alike.
      </p>
      <button
        class="bg-primary text-white font-bold h-12 px-6 rounded-lg hover:bg-primary/90 transition-all text-base animate-on-load animate-fade-in-up shadow-lg hover:shadow-xl"
        style="animation-delay: 0.6s"
      >
        Browse Products
      </button>
    </div>
  </div>
</template>
