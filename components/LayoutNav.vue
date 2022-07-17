<template>
  <client-only>
    <b-nav
      class="navbar fixed-top navbar-expand-md navbar-light bg-light py-md-1"
    >
      <div class="container">
        <!-- ホームリンク -->
        <a href="./index.html" class="navbar-text" aria-label="ホーム">
          <i class="fa fa-home fa-lg"></i>
        </a>

        <div id="navbarSupportedContent" class="collapse navbar-collapse">
          <div class="navbar-nav mr-auto">
            <div class="nav-item dropdown ml-md-3">
              <b-nav-item-dropdown
                id="navbarDropdown"
                class="nav-link room-list-menu"
                href="#"
                text="ルーム エディット"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <b-dropdown-item @click="callCompAMethod"
                  >新しいルームを作成</b-dropdown-item
                >
                <div v-if="this.cyrrentRoom !== 'default'">
                  <b-dropdown-item @click="deleteRoomOn"
                    >現在のルームを削除</b-dropdown-item
                  >
                </div>
              </b-nav-item-dropdown>
            </div>
            <div class="nav-item dropdown ml-md-3">
              <b-nav-item-dropdown
                id="navbarDropdown"
                class="nav-link room-list-menu"
                href="#"
                :text="`現在のルーム: ` + cyrrentRoom"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <b-dropdown-item
                  v-for="(room, index) in rooms"
                  :key="room.id"
                  @click="changeRoomMethod(index)"
                  >{{ room.roomName }}</b-dropdown-item
                >
              </b-nav-item-dropdown>
            </div>
          </div>

          <div class="navbar-nav dropdown">
            <div class="nav-item">
              <b-nav-item-dropdown
                href="#"
                id="navbarRightDropdown"
                class="nav-link menu-profile py-0"
                data-toggle="dropdown"
                role="button"
                text="option"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <b-dropdown-item>
                  <a
                    class="dropdown-item room-settings-link"
                    data-toggle="modal"
                    @click="callCompAMethodOptin"
                  >
                    設定
                  </a>
                </b-dropdown-item>
                <div role="separator" class="dropdown-divider"></div>
                <b-dropdown-item>
                  <a id="logout__link" class="dropdown-item" @click="signOut"
                    >ログアウト</a
                  >
                </b-dropdown-item>
              </b-nav-item-dropdown>
            </div>
          </div>
        </div>
      </div>
    </b-nav>
  </client-only>
</template>
<script>
import { getAuth, signOut } from 'firebase/auth'

import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import EventBus from '~/assets/js/roomModal.js'
import Bus from '~/assets/js/event-bus.js'

export default {
  name: 'LayoutNav',
  props:{
    uid:{
      type:String
    }
  },
  data() {
    return {
      roomShow: true,
      cyrrentRoom: 'default', // 現在のルーム
      rooms: '',
      roomIndex: '',
    }
  },
  created() {
    this.roomsGet()
  },
  methods: {
    callCompAMethod() {
      EventBus.$emit('pass-event')
    },
    callCompAMethodOptin() {
      Bus.$emit('pass')
    },
    // fireStoreのroomsをget
    async roomsGet() {
      const db = getFirestore()
      const docSnap = await getDoc(doc(db, 'rooms', 'default'))
      if (docSnap.exists()) {
        const room = docSnap.data().room
        this.rooms = room
      } else {
        console.log('No such document!')
      }
    },
    // this.cyrrentRoomに現在のroomを挿入
    changeRoomMethod(index) {
      this.roomIndex = index
      this.cyrrentRoom = this.rooms[index].roomName
      this.$emit('child-event', this.cyrrentRoom)
    },
    // cyrrentroomを削除
    async deleteRoom() {
      
      const db = getFirestore()
      const docSnap = await getDoc(doc(db, 'rooms', 'default'))
      if (docSnap.exists()) {
        const datas = docSnap.data().room
        const val = datas.filter((data) => {
          return data.roomName !== this.cyrrentRoom
        })
        this.roomUpdate(val)
      } else {
        console.log('No such document!')
      }
    },

    async roomUpdate(e) {
      const db = getFirestore()
      await setDoc(doc(db, 'rooms', 'default'), {
        room: e,
      })
      location.reload()
    },
    // cyrrentRoom.createdByuidを返す
    async deleteRoomAuth() {
      const db = getFirestore()
      const docSnap = await getDoc(doc(db, 'rooms', 'default'))
      if (docSnap.exists()) {
        const datas = docSnap.data().room[this.roomIndex].createdByuid
        return datas
      } else {
        console.log('No such document!')
      }
    },
    // cyrrentRoom.createdByuid===ログインuserならdeleteRoom実行
    deleteRoomOn(){
      this.deleteRoomAuth().then((value)=>{
        if(value===this.uid){
          this.deleteRoom()
        }else{
          alert('ルームを削除できるのは作成者のみです。作成者以外は削除できません。ご了承ください。')
        }
      })
    },

    signOut() {
      const auth = getAuth()
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          this.$store.commit('logout')
          this.$router.push({ path: '/' })
        })
        .catch((error) => {
          // An error happened.
          console.error(error)
        })
    },
  },
}
</script>

