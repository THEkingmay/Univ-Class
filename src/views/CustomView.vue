<script setup>
import { onMounted, reactive, computed,ref } from 'vue';
import { useClassStore } from '@/stores/counter';
import { useRouter } from 'vue-router';
import Warning from '../components/warning.vue'
const showAlert = ref(false);
const isEdit = ref(false)
const router = useRouter();
const store = useClassStore();
let currentSubject = reactive({})
let currentDay=ref('')
onMounted(() => {
    console.log('All classes:', store.class);
});

const newSubject = reactive({
    name: '',
    code: '',
    start: '',
    end: '',
    room: '',
    color: '#ffffff' // default color
});

const selectedDay = reactive({ 
    day: store.days[0] // Initial day set to Sunday
});

const subjectsForSelectedDay = computed(() => {  
    const dayData = store.class.find(classDay => classDay.day === selectedDay.day);
    console.log(dayData);
    return dayData ? dayData.subject : [];
});

const addClass = () => {
    if (
        newSubject.name !== '' &&
        newSubject.code !== '' &&
        newSubject.start !== '' &&
        newSubject.end !== '' &&
        newSubject.room !== '' &&
        newSubject.color !== '' &&
        parseInt(newSubject.start) >= 8 &&
        parseInt(newSubject.start) <= 21 &&
        parseFloat(newSubject.start) < parseFloat(newSubject.end) && // Ensure start time is less than end time
        !isEdit.value
    ) {
        const daydata = store.class.find(d => d.day === selectedDay.day);
        console.log('daydata1:',daydata)
        if (daydata) {  // ใช้เช็คว่าไม่เป็น null & undefined
            store.addClass({...newSubject}, selectedDay.day); // Use spread operator to copy data
            resetNewSubject();
            isEdit.value = false;
        } else {
            console.error(`No classes found for ${selectedDay.day}`);
        }
    } else if (isEdit.value) {
        const daydata = store.class.find(d => d.day === currentDay.value);
        console.log('daydata2:',daydata)
        if (daydata) {  // ใช้เช็คว่าไม่เป็น null & undefined
            if (
            newSubject.name !== '' &&
            newSubject.code !== '' &&
            newSubject.start !== '' &&
            newSubject.end !== '' &&
            newSubject.room !== '' &&
            newSubject.color !== '' &&
            parseInt(newSubject.start) >= 8 &&
            parseInt(newSubject.start) <= 21 &&
            parseFloat(newSubject.start) < parseFloat(newSubject.end)// Ensure start time is less than end time
            ){
                const subjectIndex = daydata.subject.findIndex(sub => sub.name === currentSubject.name);
                daydata.subject.splice(subjectIndex, 1);
                store.addClass({...newSubject}, selectedDay.day); // Use spread operator to copy data
                resetNewSubject();
                isEdit.value = false;
                currentSubject = {};
                currentDay.value = '';
            }else{
                showAlert.value = true;    
                setTimeout(() => {
                    showAlert.value=false
                }, 2000);
            }
        } else {
            console.error(`No classes found for ${currentDay.value}`);
        }
    } else {
        showAlert.value = true;    
        setTimeout(() => {
            showAlert.value=false
        }, 2000);
    }
}


const resetNewSubject = () => {
    newSubject.name = '';
    newSubject.code = '';
    newSubject.start = '';
    newSubject.end = '';
    newSubject.room = '';
    newSubject.color = '#ffffff';
}

const editClass = (subject,day) => {
    newSubject.name = subject.name;
    newSubject.code = subject.code;
    newSubject.start = subject.start;
    newSubject.end = subject.end;
    newSubject.room = subject.room;
    newSubject.color = subject.color;
    console.log('Edit subject:', subject,selectedDay.day);
    isEdit.value=true
    currentSubject=subject
    currentDay.value=day
    console.log('current:',currentSubject,currentDay.value)
}

const deleteClass = (subject) => {
    store.deleteClass(selectedDay.day,subject.name)
    console.log('Delete subject:', subject,selectedDay.day);
}

const targetElement=ref(null)
const scrollToTarget = () => {
  if (targetElement.value) {
    targetElement.value.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<template>
    <div v-if="showAlert">
        <Warning/>
    </div>
    <div class="p-3" ref="targetElement">
        <button class="btn" @click="router.push('/')">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                <path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path>
                <path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path>
            </svg>
        </button>
    </div>
    <div class="p-3">
        <label for="day-select" class="block mb-2 text-lg font-medium text-gray-900">Select a Day</label>
        <select v-model="selectedDay.day" class="block w-full p-2.5 border border-gray-300 rounded-lg">
            <option v-for="day in store.days" :key="day" :value="day">{{ day }}</option>
        </select>
    </div>
    <div class="p-3 space-y-4">
        <input v-model="newSubject.name" type="text" placeholder="Class Fullname" class="input input-bordered w-full" />
        <input v-model="newSubject.code" type="text" placeholder="Class Abbreviation Code" class="input input-bordered w-full" />
        <input v-model="newSubject.start" type="number" placeholder="Class Start Time (>=8.00)" class="input input-bordered w-full" min="8" max="21" />
        <input v-model="newSubject.end" type="number" placeholder="Class End Time (<=21.00)" class="input input-bordered w-full" min="8" max="21" />
        <input v-model="newSubject.room" type="text" placeholder="Class Room" class="input input-bordered w-full" />
        <input v-model="newSubject.color" type="color" class="input input-bordered w-full" />
        <button v-if="!isEdit" class="mt-3 btn btn-accent w-full" @click="addClass">Add Class</button>
        <button v-else class="mt-3 btn  btn-warning w-full" @click="addClass">Edit</button>
    </div>
    <div class="p-3">
        <h2 class="text-xl font-semibold">Subjects for {{ selectedDay.day }}</h2>
        <div v-if="subjectsForSelectedDay.length === 0" class="text-gray-500">
            No subjects scheduled for this day.
        </div>
        <div v-else>
            <ul class="mt-2 space-y-2">
                <li v-for="(subject, index) in subjectsForSelectedDay" :key="`${subject.code}-${index}`" class="p-3 border rounded-md bg-gray-100 flex justify-between items-center">
                    <div>
                        <div><strong>Subject:</strong> {{ subject.name }}</div>
                        <div><strong>Code:</strong> {{ subject.code }}</div>
                        <div><strong>Time:</strong> {{ subject.start }} - {{ subject.end }}</div>
                        <div><strong>Room:</strong> {{ subject.room }}</div>
                        <div><strong>Color:</strong> <span :style="{ backgroundColor: subject.color }" class="inline-block w-4 h-4 rounded-full"></span></div>
                    </div>
                    <div>
                        <button class="mr-5" @click="editClass(subject,selectedDay.day),scrollToTarget()">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 10C7.433 10 9 8.433 9 6.5C9 4.567 7.433 3 5.5 3C3.567 3 2 4.567 2 6.5C2 8.433 3.567 10 5.5 10Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5 21C7.433 21 9 19.433 9 17.5C9 15.567 7.433 14 5.5 14C3.567 14 2 15.567 2 17.5C2 19.433 3.567 21 5.5 21Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 6L8.64999 15.98" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 17.97L8.64999 7.97998" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <button @click="deleteClass(subject)">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
svg {
    width: 1.5rem;
    height: 1.5rem;
}
</style>
