<script setup>
import { useClassStore } from '../stores/counter'
import { computed,ref,onMounted, reactive } from 'vue'
import Noclass from '../components/noClass.vue'

const store = useClassStore()
const isNoclass=ref(true)
const updateIsNoClass = () => {
  isNoclass.value = store.class.every(classDay => classDay.subject.length === 0)
}

onMounted(()=>{
  store.class.forEach(day => {
    day.subjectVisible=false
  });
  console.log(store.class)
  updateIsNoClass()
})
const getClassDetails = (day, time) => { // ฟังก์ชันนี้ใช้ระบายสีตามช่องเวลา
  const classDay = store.class.find(classDay => classDay.day === day)
  if (classDay) {
    return classDay.subject.filter(subject =>
      subject.start <= time && time < subject.end
    )
  }
  return []
}
const hasClasses = (day) => {
  const classDay = store.class.find(classDay => classDay.day === day)
  if(classDay.subject.length > 0)
  isNoclass.value=false  // ถ้ามีไม่วิชาเรียน จะแสดงข้อความบอกว่าไม่มีเรียน แต่ถ้ามีเรียนจะไม่แสดง
  return classDay && classDay.subject.length > 0 //ถ้าวันไหนตรงเงื่อนไข็จะคืนค่าไปเก็บใน filteredDays
}

const filteredDays = computed(() => store.days.filter(day => hasClasses(day)))  // ในตารางจะใช้แสดงวันเพียงที่มีวิชาเรียนเท่านั้น
const toggleClassDetails = (day) => {
  const classDay = store.class.find(c => c.day === day)
  classDay.subjectVisible = !classDay.subjectVisible
}
</script>

<template>
  <div v-if="isNoclass"><Noclass/></div>
  <div v-else class="flex flex-col ">
  <div class="p-5">
    <div class="w-full flex justify-center text-2xl">Class</div> 
    <div  v-for="day in store.days">
      <div class="p-3 border-b cursor-pointer" @click="toggleClassDetails(day)">
        <div class="font-bold flex justify-end px-3" 
        :class="{ 'text-xl': store.class.find(c => c.day === day).subjectVisible }">
          {{ day }}
        </div>
        <div class=" border-b mt-3 p-2" 
          v-if="store.class.find(c => c.day === day).subjectVisible && store.class.find(c => c.day === day).subject.length>0" 
          v-for="subject in store.class.find(d=>d.day===day).subject" 
          :key="`${day}-${subject.code}`"
          >
          <div class="font-semibold md:flex flex-col items-center md:text-xl">
              <div :style="{ backgroundColor: subject.color }" class="h-4 w-9 rounded"></div>
              <div>Subject : {{ subject.name }} </div>
              <div>Time : {{ subject.start }}-{{ subject.end }}</div>
              <div>Room : {{ subject.room }}</div>
              <div>Sec : {{ subject.code }} </div>
          </div>
        </div>
        <div v-if="store.class.find(c => c.day === day).subjectVisible && store.class.find(c => c.day === day).subject.length==0" >
          <div class="flex justify-center"> Don't have class on {{ day }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="hidden md:block border-t">
    <div class="p-3">
      <div class="grid grid-cols-7">
        <div class="border-b border-r col-span-1 flex items-center justify-center">
          Day & Time
        </div>
        <div class="col-span-6">
          <div class="flex w-full justify-between">
            <div v-for="time in store.times" :key="time" class="border-b py-3 w-full flex items-center justify-center">
              {{ time }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-3 h-full">
      <div v-for="day in filteredDays" :key="day" class="grid grid-cols-7">
        <div class="border-b border-r col-span-1 flex items-center justify-center">
          {{ day }}
        </div>
        <div class="col-span-6 overflow-auto">
          <div class="flex w-full justify-between">
            <div v-for="time in store.times" :key="time" class="w-full border-b flex items-center justify-center">
              <div class="w-full py-2 text-center">
                <div v-for="classItem in getClassDetails(day, time)" 
                  :key="classItem.code" class="p-1"
                  :style="{ backgroundColor: classItem.color }"
                >
                  <div class="font-semibold">{{ classItem.code }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
