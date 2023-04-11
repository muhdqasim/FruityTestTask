<template>
    <div id="fruitsList" class="container" @scroll="onScroll()">
      <v-container>
        <div class="d-flex justify-end">
          <v-btn color="primary" @click="app.logout()">Logout</v-btn>
        </div>
      </v-container>
      <v-container class="v-col-9">
          <div class="card mb-3">
            <div class="shadowyText font-weight-bold text-h1" style="font-family: Kalam-B !important;">List of Fruits</div>
            <div class="card-body">
              <div class="row d-flex v-col-6 justify-center mr-auto ml-auto">
                  <v-text-field
                    v-model="fruit_name"
                    label="Filter by Name"
                    hide-details="auto"
                    style="background-color: rgb(0,0,0, 0.3); color: white; border: transparent"
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <v-select
                    :items="family"
                    hide-details="auto"
                    label="Filter by family"
                    v-model="selected_family"
                    style="background-color: rgb(0,0,0, 0.3); color: white; border: transparent"
                  >
                    <template v-slot:prepend-item>
                      <v-list-item
                        title="Select Family"
                        value=""
                      >
                      </v-list-item>
                    </template>
                  </v-select>
              </div>
            </div>
          </div>
        <v-card
          class="mx-auto"
          max-width="544"
          :min-height="300"
          variant="elevated"
          style="background-color: rgb(255,255,255,0.9); margin-bottom: 40px; box-shadow: 8px 8px 12px 2px rgba(7,7,7,0.43); font-family: Kalam-L"
        >
          <v-card-text>
            <p class="mt-10 fruitName">
              Total Nutritional Value
            </p>
            <table style="margin-left: auto; margin-right: auto; margin-top: 20px">
              <tr v-for="(value, nutritionalUnit) in totalNutritionalValue">
                <td class="text-left">{{capitalized(nutritionalUnit)}}:</td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td class="text-right">{{value}}</td>
              </tr>
            </table>
          </v-card-text>
        </v-card>
          <template v-for="fruit in filtered_fruits"
                    :key="fruit.id">
            <v-card
              class="mx-auto"
              max-width="544"
              :min-height="fruit.reveal ? 300 : 100"
              variant="elevated"
              style="background-color: rgb(255,255,255,0.9); margin-bottom: 40px; box-shadow: 8px 8px 12px 2px rgba(7,7,7,0.43); font-family: Kalam-L"
            >
              <v-card-text>
                <div>
                  Fruit Name
                  <v-btn
                    density="comfortable"
                    class="float-right"
                    icon="mdi-heart"
                    :color="!fruit.isFavorite ? 'white' : 'red'"
                    @click="fruitsStore.toggleFavorite(fruit)"
                  ></v-btn></div>
                <p class="mt-5 fruitName">
                  {{ fruit.name }}
                </p>

                <div class="text--primary d-flex justify-space-evenly mt-5 fruitCred" >
                  Order: <b>{{ fruit.genus }}</b> | &nbsp; Family: <b>{{ fruit.family }}</b> | &nbsp;  Genus: <b>{{ fruit.genus }}</b>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  variant="text"
                  color="teal-accent-4"
                  @click="showInfo(fruit)"
                  class="ml-5 mb-5"
                >
                  Learn More
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <v-card
                  v-if="fruit.reveal"
                  class="v-card--reveal"
                  style="height: 100%;"
                >
                  <v-card-text>
                    <p class="mt-10 fruitName">
                      Nutritional Value
                    </p>
                    <table style="margin-left: auto; margin-right: auto; margin-top: 20px">
                      <tr v-for="(value, nutritionalUnit) in fruit.nutritions">
                        <td class="text-left">{{capitalized(nutritionalUnit)}}:</td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td class="text-right">{{value}}</td>
                      </tr>
                    </table>
                  </v-card-text>
                  <v-card-actions class="pt-0">
                    <v-btn
                      variant="text"
                      color="teal-accent-4"
                      @click="hideInfo(fruit)"
                      class="ml-auto mr-auto"
                    >
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-expand-transition>
            </v-card>
          </template>
      </v-container>

    </div>
</template>

<script>
import { useFruitsStore } from "@/store/fruits";
import { useAppStore } from "@/store/app";
import _ from 'lodash'

export default {
  setup() {
    const fruitsStore = useFruitsStore()
    const app = useAppStore()
    return { fruitsStore, app }
  },
  name: 'FruitsList',
  data () {
    return {
      fruits: [],
      selected_family: '',
      fruit_name: '',
      pageNo: 1,
      totalNutrition: []
    }
  },
  props: {
    msg: String,
  },
  computed: {
    totalNutritionalValue(){
      let totalNutrition = {};
      _.each(this.fruitsStore.fruitsList, (fruit) => {
        _.each(fruit.nutritions, (nutrition, key) => {
            if(!totalNutrition[key]){
              totalNutrition[key] = nutrition
            }else{
              totalNutrition[key] += nutrition
            }
        })
      })
      return totalNutrition;
    },
    filtered_fruits () {

      let family = this.selected_family
      let fruit_name = this.fruit_name
      let fruits = _.cloneDeep(this.fruitsStore.fruitsList)

      if (family !== '') {
        fruits = fruits.filter(f => f.family === family)
      }

      if (fruit_name !== '') {
        fruits = fruits.filter(f => f.name.toLowerCase().includes(fruit_name.toLowerCase()))
      }

      return fruits
    },

    family () {
      let fruit_family = []
      this.fruitsStore.fruitsList.forEach(function (value) {
        if (!fruit_family.includes(value.family)) {
          fruit_family.push(value.family)
        }
      })
      return fruit_family
    },
  },
  methods: {
    toggleFavorite(fruit) {
      if(fruit.isFavorite){

      }
    },
    capitalized(name) {
      const capitalizedFirst = name[0].toUpperCase();
      const rest = name.slice(1);
      return capitalizedFirst + rest;
    },
    showInfo (fruit) {
      let index = _.findIndex(this.fruitsStore.fruitsList, (item, key) => {
        return item.id === fruit.id
      })
      this.fruitsStore.revealFruit(index)
    },
    hideInfo(fruit){
      let index = _.findIndex(this.fruitsStore.fruitsList, (item, key) => {
        return item.id === fruit.id
      })
      this.fruitsStore.hideFruit(index)
    }
  },
  async mounted () {
    await this.fruitsStore.fetchFruits(1);
    const masonry = document.querySelector('#routerView');
    masonry.addEventListener('scroll', async (e) => {
      if (masonry.scrollTop + masonry.clientHeight >= masonry.scrollHeight) {
        this.pageNo++
        await this.fruitsStore.fetchFruits(this.pageNo);
      }
    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
.fruitCred {
  font-family: "Comic Sans MS";
}
.fruitCred > b {
  font-size: 18px;
  font-family: Kalam-B;
}
.fruitName {
  font-size: 30px;
}
</style>
