<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from '@/components/navbar.vue'
</script>

<template>
  <div class="flex flex-col w-full h-fit max-w-4xl mx-auto border-l border-r pb-60">
    <Navbar>
        <RouterView/>
    </Navbar>
  </div>
</template>