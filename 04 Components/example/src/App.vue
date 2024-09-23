<script setup lang="ts">
  import {persons, employees, createModel} from './model'
  import { ref, reactive, computed } from 'vue'
  import PersonView from '@/PersonTable.vue'

  const model = reactive(createModel(persons, employees))
  const salary = ref(0)
  const error = ref<string|undefined>(undefined)

  function hire(id: number) {
    const person = model.personById(id)
    if (person === undefined) {
      error.value = 'No person selected'
      return
    }
    if (person.employeeId !== undefined) {
      error.value = 'Person already hired'
      return
    }
    if (salary.value <= 0) {
      error.value = 'Salary must be positive'
      return
    }
    model.hire(person, salary.value)
    salary.value = 0
    error.value = undefined
  }
</script>

<template>
    <h1>People</h1>
    <div id='base'>
      <person-view :person-data="model.personData()" @hire="id=>hire(id)"></person-view>
      <div>Salary: <input v-model='salary' id='salary'></div>
      <div>{{error}}</div>
    </div>
</template>
