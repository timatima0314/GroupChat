<template>
  <div>
    <form id="comment-form">
      <div class="input-group">
        <input
          id="comment-form__text"
          type="text"
          class="form-control form-control-lg"
          v-model="inputMessage"
        />
        <span class="input-group-append">
          <button
            type="button"
            class="btn btn-lg btn-secondary comment-form__submit"
            aria-label="送信"
            @click="addMessage"
          >
            <font-awesome-icon
              :icon="['fas', 'paper-plane']"
              class="font-awesome-size-solid"
            />
            <i class="fa fa-paper-plane" aria-hidden="true"></i>
          </button>
        </span>
      </div>
      <!-- /.input-group -->
    </form>
    <!-- /#comment-form -->
  </div>
</template>
<script>
import {
  doc,
  getFirestore,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from 'firebase/firestore'

export default {
  name: 'LayoutCommentForm',
  props: {
    cyrrentRoom: {
      type: String,
    },
    uid: {
      type: String,
    },
  },
  data() {
    return {
      inputMessage: '', // 送信text
      userImg: null, // ログインuser画像
      userName: '', // ログインuser
    }
  },
  methods: {
    // text送信method
    async addMessage() {
      this.currentUserNicknameget()
      await this.userImgGet()
      const db = getFirestore()
      const washingtonRef = doc(db, 'messages', this.cyrrentRoom)
      const item = {
        text: this.inputMessage,
        uid: this.uid,
        time: this.timeStamp(),
        nickName: this.userName,
        userImg: this.userImg,
      }
      // firestoreにpush
      await updateDoc(washingtonRef, {
        message: arrayUnion(item),
      })
      this.inputMessage = ''
      this.$emit('child-event', item)
      this.scroll()
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
    // ログインuserのimgUrlをthis.userImgを挿入
    async userImgGet() {
      const db = getFirestore()
      const docSnap = await getDoc(doc(db, 'users', this.uid))
      if (docSnap.exists()) {
        if (docSnap.data().user.imgUrl) {
          const data = docSnap.data().user.imgUrl
          this.userImg = data
        } else {
          console.log('No img')
          this.userImg = null
        }
      }
    },
    // ログインuserのnicknameをthis.userNameに挿入
    async currentUserNicknameget() {
      const db = getFirestore()
      const docRef = doc(db, 'users', this.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data().user.nickname
        this.userName = data
      } else {
        console.log('No such document!')
      }
    },
    // addMessage()実行後、画面を下層へ
    scroll() {
      const db = getFirestore()
      onSnapshot(doc(db, 'messages', 'default'), (doc) => {
        $('html, body').scrollTop($(document).height())
      })
    },
  },
}
</script>
<style scoped>
#comment-form {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
}
</style>
