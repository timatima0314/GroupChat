<template>
  <div>
    <client-only>
      <modal
        id="createRoomModal"
        class="mod"
        name="create-room-modal-content"
        height="auto"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <form id="create-room-form">
              <div class="modal-header">
                <h4 class="modal-title">ルーム作成</h4>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  @click="hide"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div id="create-room__room-name" class="form-group">
                  <label for="room-name" class="col-form-label"
                    >ルーム名を入力してください</label
                  >
                  <input
                    id="room-name"
                    type="text"
                    class="form-control"
                    v-model="roomName"
                    required
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-default"
                  data-dismiss="modal"
                  @click="hide"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="createRoom"
                >
                  作成
                </button>
              </div>
            </form>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </modal>
      <!-- /#createRoomModal -->
    </client-only>
  </div>
</template>
<script>
import {
  doc,
  getFirestore,
  updateDoc,
  arrayUnion,
  Timestamp,
  setDoc,
} from 'firebase/firestore'
import EventBus from '~/assets/js/roomModal.js'

export default {
  name: 'LayoutCreateRoomModal',
  props: {
    uid: {
      // ログインuserId
      type: String,
    },
    cyrrentRoom: {
      type: String,
    },
  },
  data() {
    return {
      roomName: '', // ルームの名前
    }
  },
  created() {
    EventBus.$on('pass-event', () => {
      this.show()
    })
  },

  methods: {
    show() {
      this.$modal.show('create-room-modal-content')
    },
    hide() {
      this.roomName = ''
      this.$modal.hide('create-room-modal-content')
    },
    // ルーム作成
    async createRoom() {
      if (this.roomName === '') {
        alert('ルーム名を入力してください')
      } else {
        const db = getFirestore()
        const washingtonRef = doc(db, 'rooms', 'default')
        const item = {
          createdAt: Timestamp.now(),
          createdByuid: this.uid,
          roomName: this.roomName,
        }
        // Firestoreにpush
        await updateDoc(washingtonRef, {
          room: arrayUnion(item),
        })
        this.createMessageRoom()
        alert('新しいルームを作成しました。')
        location.reload()
      }
    },
    // 作成されたルームに空objectを入れておく
    async createMessageRoom() {
      const db = getFirestore()
      await setDoc(doc(db, 'messages', this.roomName), {
        message: [],
      })
    },
  },
}
</script>
<style scoped>
.mod {
  z-index: 2000;
}
</style>