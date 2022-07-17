<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-sm-10 col-md-8 col-lg-6">
        <form id="login-form">
          <div class="form-group login__email">
            <label for="login-email" class="col-form-label">
              メールアドレス
            </label>
            <div>
              <input
                v-model="emailAddress"
                type="email"
                class="form-control"
                required
              />
            </div>
          </div>
          <div class="form-group login__password">
            <label for="login-password" class="col-form-label">
              パスワード
            </label>
            <div>
              <input
                v-model="password"
                type="password"
                class="form-control"
                required
              />
            </div>
          </div>
          <div class="form-group login__submit">
            <div>
              <button type="button" class="btn btn-primary" @click="SignIn">
                ログイン
              </button>
              <button type="button" class="btn btn-success">
                <a href="/sing_up" style="color: #ffffff">新規登録はこちら</a>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'

export default {
  data() {
    return {
      emailAddress: '',
      password: '',
      uid: '', // ログインuserId
    }
  },
  methods: {
    // ログインmethods
    SignIn() {
      try {
        const auth = getAuth()
        signInWithEmailAndPassword(auth, this.emailAddress, this.password)
          .then((user) => {
            this.$store.commit('login')
            this.$router.push({ path: '/main' })
          })
          .catch((error) => {
            console.error(error)
            alert(
              'パスワードまたはメールアドレスが間違っているためログインできません'
            )
          })
      } catch (e) {
        console.error(e)
      }
    },
    // ログインuserのidをthis.uidに挿入
    async authMethod() {
      const auth = getAuth()
      await onAuthStateChanged(auth, (user) => {
        if (user) {
          this.uid = user.uid
        } else {
          console.log('No such document!')
          this.$router.push({ path: '/' })
        }
      })
      return this.uid
    },
    timeStamp() {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth()
      const date = now.getDate()
      const hour = now.getHours()
      const min = now.getMinutes()
      const output = `${year}/${month + 1}/${date}/${hour}:${min}`
      return output
    },
  },
}
</script>
<style scoped>
.container {
  margin-top: 10%;
}
</style>