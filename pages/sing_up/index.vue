<template>
  <div class="container">
    <h1>SingUp</h1>
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
          <div class="form-group login__nickname">
            <label for="login-nickname" class="col-form-label">
              ニックネーム
            </label>
            <div>
              <input
                v-model="nickname"
                type="text"
                class="form-control"
                required
              />
            </div>
          </div>
          <div class="form-group row">
            <div class="col-lg-3">プロフィール画像</div>
            <div class="col-lg-7 mb-2 mb-lg-0">
              <div class="custom-file">
                <input
                  id="settings-profile-image"
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif, image/jpeg,image/png,image/gif"
                  class="custom-file-input"
                  @change="onImageUploaded"
                />
                <label
                  id="settings-profile-image-label"
                  class="custom-file-label"
                  for="settings-profile-image"
                  >{{imageSet}}</label
                >
              </div>
              <p style="font-size: 12px">
                ※サムネイル画像を設定できます。設定しない場合デフォルトの画像になります。画像はいつでも変更可能です。
              </p>
            </div>
            <div class="col-lg-2">
              <label for="settings-profile-image"> </label>
              <div id="settings-profile-image-loading-container">
                <i
                  class="settings-profile-image-loading-icon fa fa-refresh"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
          </div>
          <div class="form-group login__submit">
            <div>
              <button type="button" class="btn btn-success" @click="SignUp">
                新規登録
              </button>
              <button type="button" class="btn btn-primary">
                <a href="/" style="color: #ffffff">ログインはこちら</a>
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
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, getFirestore, setDoc } from 'firebase/firestore'

export default {
  data() {
    return {
      emailAddress: '',
      password: '',
      uid: '',
      nickname: '',
      imgUrl: '',
      image: null,
    }
  },
    computed: {
    // 表紙画像form書き換え
    imageSet() {
      if (this.image === null) {
        return 'file選択'
      } else {
        return this.image.name
      }
    },
  },

  methods: {
    // 新規登録methods
    SignUp() {
      const auth = getAuth()
      createUserWithEmailAndPassword(auth, this.emailAddress, this.password)
        .then((userCredential) => {
          this.$store.commit('login')
          this.$router.push({ path: '/main' })
          this.authMethod().then((value) => {
            if (this.image === null) {
              this.createUser()
              return
            }
            this.uploadImg(value)
          })
        })
        .catch((error) => {
          alert(error.message)
          console.error(error)
        })
    },
    // userIdをthis.uidに挿入
    async authMethod() {
      const auth = getAuth()
      await onAuthStateChanged(auth, (user) => {
        if (user) {
          this.uid = user.uid
        } else {
          console.log('No such document!')
        }
      })
      return this.uid
    },
    // firestroreに'users/uid/user'をcreated
    async createUser() {
      const db = getFirestore()
      await setDoc(doc(db, 'users', this.uid), {
        user: {
          createdAt: this.timeStamp(),
          nickname: this.nickname,
          imgUrl: this.imgUrl,
        },
      })
    },
    timeStamp() {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth()
      const date = now.getDate()
      const hour = now.getHours()
      const min = now.getMinutes()
      const output = `${year}/${month + 1}/${date}/${hour}:${min}`
      console.log(output)
      return output
    },
    // プロフィール画像fileをthis.imageに挿入
    onImageUploaded(e) {
      const image = e.target.files[0]
      this.image = image
    },
    // プロフィール画像を'uid/uid.img'でstorageに保存
    async uploadImg(uid) {
      const storage = getStorage()
      const storageRef = ref(storage, `${uid}/${uid}.img`)
      await uploadBytes(storageRef, this.image).then((snapshot) => {
        console.log('Uploaded a blob or file!')
      })
      this.getimgUrl(uid)
    },
     // プロフィール画像のurlをthis.imgUrlに挿入
    getimgUrl(uid) {
      const storage = getStorage()
      const gsReference = ref(
        storage,
        `gs://groupchat-a6478.appspot.com/${uid}/${uid}.img`
      )
      getDownloadURL(gsReference)
        .then((url) => {
          this.imgUrl = url
          this.createUser()
        })
        .catch((err) => console.log(err))
    },
  },
}
</script>
<style scoped>
.container {
  margin-top: 10%;
}
</style>