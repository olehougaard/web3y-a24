<script lang="ts">
  import {persons, employees, createModel} from './model'
  import { defineComponent } from 'vue'

  export default defineComponent({ 
    data() {
      return {
        model: createModel(persons, employees),
        salary: 0,
        error: undefined
      }
    },
    computed: {
      personData() { return this.model.personData() }
    },
    methods: {
      hire(id: number) {
        const person = this.model.personById(id)
        if (person === undefined) {
          this.error = 'No person selected'
          return
        }
        if (person.employeeId !== undefined) {
          this.error = 'Person already hired'
          return
        }
        if (this.salary <= 0) {
          this.error = 'Salary must be positive'
          return
        }
        this.model.hire(person, this.salary)
        this.salary = 0
        this.error = undefined
      }
    }
  })
</script>

<template>
    <h1>People</h1>
    <div id='base'>
        <table id='employees'>
            <thead><tr><td>Id</td><td>Name</td><td>Employee id</td><td>Salary</td><td>Manager</td></tr></thead>
            <tbody id='employee_data'>
                <tr v-for='p in personData'>
                    <td>{{ p.id }} </td>
                    <td>{{ p.name }} </td>
                    <template v-if='p.employeeId'>
                        <td>{{ p.employeeId }}</td>
                        <td>{{ p.salary ?? 0 }}</td>
                        <td>{{ Boolean(p.manager) }}</td>
                    </template>
                    <template v-else>
                        <td colspan = "3"><button v-on:click='hire(p.id)'>Hire</button></td>
                    </template>
                </tr>
            </tbody>
        </table>
        <div>Salary: <input v-model='salary' id='salary'></div>
        <div v-if="error !== undefined">{{error}}</div>
    </div>
</template>
