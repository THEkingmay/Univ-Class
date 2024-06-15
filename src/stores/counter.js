import { defineStore } from 'pinia';

export const useClassStore = defineStore('class', {
  state: () => ({
    times: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    class: JSON.parse(localStorage.getItem('classData')) ||[
      { day: "Sunday", subject: [] },
      { day: "Monday", subject: [] },
      { day: "Tuesday", subject: [] },
      { day: "Wednesday", subject: [] },
      { day: "Thursday", subject: [] },
      { day: "Friday", subject: [] },
      { day: "Saturday", subject: [] },
    ]
  }),
  actions:{
    addClass(data,day){
      const daydata=this.class.find(d=>d.day===day)
      daydata.subject.push(data)
      console.log("daydata store:",daydata)
      this.sortdata(day);
      this.savetolocal();
    },
    deleteClass(day,subname){
      const daydata = this.class.find(d => d.day === day);
      const subjectIndex = daydata.subject.findIndex(sub => sub.name === subname);
      if (subjectIndex !== -1) {
        daydata.subject.splice(subjectIndex, 1); 
        this.sortdata(day); 
        this.savetolocal();
      } else {
        console.error(`Subject "${subname}" not found in "${day}"`);
      }
    },
    sortdata(day){
      const daydata = this.class.find(d => d.day === day);
      daydata.subject.sort((a, b) => a.start - b.start);
      console.log("Sorted subjects for", day, daydata.subject);
    },
    savetolocal(){
      localStorage.setItem('classData', JSON.stringify(this.class));
      console.log("All class", this.class);
    }
  }
});
