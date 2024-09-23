<script setup lang="ts">
  import {persons, employees, createModel, Data} from './model'
  import { ref, defineEmits, defineProps } from 'vue'
  import type { PropType } from 'vue'

  defineProps<{
    personData: Data[]
  }>()

  let emit = defineEmits({
    hire(_: number) {
      return true
    }
  })

  function hire(id: number) {
    emit('hire', id)
  }
</script>

<template>
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
</template>
