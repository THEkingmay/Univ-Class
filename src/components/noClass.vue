<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
</script>
<template>
    <div class="flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ">
        <div>
            <svg class="w-12 text-primary-content" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7 11.6C7 11.0399 7 10.7599 7.10899 10.546C7.20487 10.3578 7.35785 10.2049 7.54601 10.109C7.75992 10 8.03995 10 8.6 10H15.4C15.9601 10 16.2401 10 16.454 10.109C16.6422 10.2049 16.7951 10.3578 16.891 10.546C17 10.7599 17 11.0399 17 11.6V12.4C17 12.9601 17 13.2401 16.891 13.454C16.7951 13.6422 16.6422 13.7951 16.454 13.891C16.2401 14 15.9601 14 15.4 14H8.6C8.03995 14 7.75992 14 7.54601 13.891C7.35785 13.7951 7.20487 13.6422 7.10899 13.454C7 13.2401 7 12.9601 7 12.4V11.6Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </div>
        <div class="text-3xl mt-2">No class now !</div>
        <div>
            <button class="btn mt-2" @click="router.push('/custom')">Lets add</button>
        </div>
    </div>
</template>