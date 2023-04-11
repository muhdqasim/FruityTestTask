<template>
  <div class="routerView">
    <v-container
      v-if="!loginForm && !registerForm"
    >
      <div class="d-flex justify-end">
        <v-btn v-if="!appStore.bearerToken" color="primary" class="mr-2" @click="registerForm = true">Register</v-btn>
        <v-btn v-if="!appStore.bearerToken" color="primary" @click="loginForm = true">Login</v-btn>
        <v-btn v-if="appStore.bearerToken" color="primary" @click="logout()">Logout</v-btn>
      </div>
      <div>
        <h1 class="shadowyText">Fruity Frontend</h1>
      </div>
    </v-container>
    <!--  <div class="d-flex justify-center" style="width: 100%">-->
    <v-container v-if="loginForm" class="d-flex justify-center mb-2">
      <v-card min-width="400" class="elevation-12 loginForm">
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="username"
              label="Username"
              type="text"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
            ></v-text-field>
            <v-alert color="warning" v-if="errorMessage !== ''">{{errorMessage}}</v-alert>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-btn color="warning" @click="loginForm = false">Back</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="login">Login</v-btn>
        </v-card-actions>
      </v-card>
      <!--  </div>-->
    </v-container>
    <v-container v-if="registerForm" class="d-flex justify-center mb-2">
      <v-card min-width="400" class="elevation-12 loginForm">
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="name"
              label="Name"
              type="text"
            ></v-text-field>
            <v-text-field
              v-model="email"
              label="Email"
              type="text"
            ></v-text-field>
            <v-text-field
              v-model="username"
              label="Username"
              type="text"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
            ></v-text-field>
            <v-alert color="warning" v-if="errorMessage !== ''">{{errorMessage}}</v-alert>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-btn color="warning" @click="registerForm = false">Back</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="register">Register</v-btn>
        </v-card-actions>
      </v-card>
      <!--  </div>-->
    </v-container>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
import {useAppStore} from "@/store/app";

export default defineComponent({
  setup() {
    const appStore = useAppStore()

    return {
      appStore
    }
  },

  name: 'Home',
  data () {
    return {
      registerForm: false,
      loginForm: false,
      name: '',
      email: '',
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  props: {
    msg: String,
  },
  computed: {

  },
  methods: {
    async login () {
      if(
        this.username === ''
        && this.password === ''
      ) {
        this.errorMessage = "Please fill in the credentials!"
        setTimeout(() => {
          this.errorMessage = ''
        }, 4000)
        return;
      }

      await axios.post(this.appStore.apiUrl+'/api/login_check', {
          "username": this.username,
          "password": this.password
      }).then((response) => {
          localStorage.bearerToken = response.data.token
          this.appStore.saveBearerToken(response.data.token)
          setTimeout(()=>{
            this.$router.push('/fruits')
          }, 500)
      }).catch((error)=>{
          this.errorMessage = error.response.data.message
      })
    },
    async register () {
      if(
        this.username === ''
        && this.password === ''
        && this.email === ''
        && this.name === ''
      ) {
        this.errorMessage = "Please fill in the credentials!"
        setTimeout(() => {
          this.errorMessage = ''
        }, 4000)
        return;
      }

      await axios.post(this.appStore.apiUrl+'/api/register', {
          "username": this.username,
          "password": this.password,
          "email": this.email,
          "name": this.name
      }).then((response) => {
          localStorage.bearerToken = response.data.token
          this.appStore.saveBearerToken(response.data.token)
          setTimeout(()=>{
            this.$router.push('/fruits')
          }, 500)
      }).catch((error)=>{
          this.errorMessage = error.response.data.message
      })
    },
    logout () {
      this.appStore.logout()
    }
  },
  async mounted () {
  },
})
</script>

<style scoped>
.loginForm {
  box-shadow: 12px 12px 2px 1px #FF0000 !important;
  margin-top: 200px;
  background-color: rgb(255, 255, 255, .9);
}
</style>
