<template>
  <layout-wrapper>
    <section id="chat" class="view">
      <layout-nav v-on:child-event="changeRoom" :uid="userId" />
      <layout-create-room-modal :uid="userId" :cyrrentRoom="cyrrentRoom" />
      <layout-optin-modal :uid="userId" />
      <div id="message-list" class="clearfix">
        <layout-message-list
          v-for="(item, index) in messageData"
          :key="item.key"
          :index="index"
          :item="item"
        />
      </div>
      <layout-comment-form
        :userName="userName"
        :cyrrentRoom="cyrrentRoom"
        v-on:child-event="messageDataPush"
        :uid="userId"
      />
    </section>
  </layout-wrapper>
</template>
<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
export default {
  data() {
    return {
      messageData: [], // messageObject
      cyrrentRoom: 'default', // 現在のroom
      userId: '', // ログインuserId
      userName: '',
    }
  },
  // middleware: 'authenticated',
  created() {
    const promise = new Promise((resolve) => {
      this.authMethod()
      resolve()
    }).then(() => {
      this.addGet()
      console.log(promise)
    })
    // $('html, body').scrollTop($(document).height())
  },
  methods: {
    // ログインuserのidをthis.uidに挿入
    async authMethod() {
      const auth = getAuth()
      await onAuthStateChanged(auth, (user) => {
        if (user) {
          this.userId = user.uid
        } else {
          console.log('No such document!')
          this.$router.push({ path: '/' })
        }
      })
    },
    // firestoreの'messages/doc/message'をthis.messageDataに挿入
    async addGet() {
      const db = getFirestore()
      const docSnap = await getDoc(doc(db, 'messages', this.cyrrentRoom))
      if (docSnap.exists()) {
        const data = docSnap.data().message
        const self = this
        // ログインuserならprop.logoutUser=falseに
        data.forEach(function (element, index) {
          if (element.uid === self.userId) {
            data[index].logoutUser = false
          } else {
            data[index].logoutUser = true
          }
        })
        this.messageData = data
      } else {
        console.log('No such document!')
      }
    },
    // room変更時、this.currentRoom変更
    async changeRoom(val) {
      this.cyrrentRoom = val
      await this.addGet()
    },
    // textが送信されたらthis.messageDataにpush
    messageDataPush(val) {
      this.messageData.push(val)
    },
  },
}
</script>
<style scoped>
#chat {
  padding-top: 54px;
}
</style>
<style scoped>
#message-list {
  max-width: 650px;
  min-height: calc(100vh - 51px - 46px + 6px);
  margin: 0 auto 40px auto;
  padding: 10px 10px 6px 10px;
  border-width: 0 1px;
  border-style: solid;
  border-color: #ccc;
  background-color: #f7f7ff;
}
</style>