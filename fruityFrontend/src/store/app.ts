// Utilities
import { defineStore } from 'pinia'
import { useFruitsStore } from './fruits'
import router from "@/router";

export const useAppStore = defineStore('app', {
  state: () => ({
      bearerToken: localStorage.bearerToken,
      apiUrl: 'http://127.0.0.1:8000'
  }),
  actions: {
    logout(){
      useFruitsStore().emptyFruitsList()
      this.bearerToken = '';
      localStorage.bearerToken = '';
      router.push('/')
    },
    saveBearerToken(token: string){
      this.bearerToken = token;
    }
  }
})
