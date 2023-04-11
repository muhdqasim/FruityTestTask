// Utilities
import {defineStore} from 'pinia'
import {useAppStore} from './app'
import _ from 'lodash'
import axios from 'axios'
import app from "@/App.vue";
export const useFruitsStore = defineStore('fruits', {

  state: () => ({
    fruitsList: [] as Fruit[],
    apiUrl: useAppStore().apiUrl
  }),
  getters: {
    fruits: (state) => state.fruitsList
  },
  actions: {
    emptyFruitsList(){
      this.fruitsList = []
    },
    revealFruit(fruitIndex: any) {
      this.fruitsList[fruitIndex].reveal = true;
    },
    hideFruit(fruitIndex: any) {
      this.fruitsList[fruitIndex].reveal = false;
    },
    async toggleFavorite(fruit: Fruit){

      const appStore = useAppStore()
        let url = this.apiUrl+'/api/save-favorite-fruit';
        if(fruit.isFavorite){
          url = this.apiUrl+'/api/remove-favorite-fruit';
        }
      let config = {
        headers: {
          'Authorization': 'Bearer ' + appStore.bearerToken,
          'Content-Type': 'application/json'
        }
      }
        await axios.post(url, {
          fruit_id: fruit.id.toString()
        }, config)
        .then((response: any) => {
          let fruitIndex = _.findIndex(this.fruitsList, (item: any) => {
            return item.id === fruit.id
          })
          this.fruitsList[fruitIndex].isFavorite = !fruit.isFavorite;
        })
        .catch((error: any) => {
            alert(error.response.data.message)
        })
    },
    async fetchFruits(pageNo = 1) {
      const appStore = useAppStore()
      let config = {
        headers: {
          'Authorization': 'Bearer ' + appStore.bearerToken,
          'Content-Type': 'application/json'
        }
      }
      await axios.get(this.apiUrl+'/api/fruits?page='+pageNo, config)
        .catch((error: any) => {
          if (error.response.data.message === 'Expired JWT Token')
            appStore.logout()
        })
        .then((response: any) => {
          let fruits = response.data.fruits;
          for (let i = 0; i < fruits.length; i++) {
            this.fruitsList.push(fruits[i])
          }
        })

    }
  }
})

interface Fruit {
  id: bigint
  name: string
  family: string
  order: string
  genus: string
  nutritions: string
  reveal: boolean,
  isFavorite:boolean
}
