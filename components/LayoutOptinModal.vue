<template>
  <div>
    <client-only>
      <!-- ユーザ情報設定モーダル -->
      <modal
        class="mod"
        id="settingsModal"
        name="optin-modal-content"
        height="auto"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header mx-3">
              <h4 class="modal-title">設定</h4>
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
            <div class="modal-body mx-3 mt-3">
              <form id="settings-form">
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
                        >{{ imageSet }}</label
                      >
                    </div>
                    <button
                      type="button"
                      @click="uploadImg"
                      class="btn btn-success"
                      style="margin-top: 10px"
                    >
                      プロフィール画像を変更
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
      </modal>
      <!-- /#settingsModal -->
    </client-only>
  </div>
</template>
<script>
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, updateDoc, getFirestore } from 'firebase/firestore'

import Bus from '~/assets/js/event-bus.js'

export default {
  name: 'LayoutOptinModal',
  props: {
    uid: {
      // ログインuserのid
      type: String,
    },
  },
  data() {
    return {
      image: null, // プロフィール画像のfile
      imgUrl: '', // プロフィール画像のurl
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

  created() {
    Bus.$on('pass', () => {
      this.show()
    })
  },
  methods: {
    show() {
      this.$modal.show('optin-modal-content')
    },
    hide() {
      this.$modal.hide('optin-modal-content')
    },
    // プロフィール画像fileをthis.imageに挿入
    onImageUploaded(e) {
      const image = e.target.files[0]
      this.image = image
    },
    // プロフィール画像を'uid/uid.img'でstorageに保存
    async uploadImg() {
      if (this.image === null) {
        alert('プロフィール画像ファイルを選択してください')
      } else {
        const storage = getStorage()
        const storageRef = ref(storage, `${this.uid}/${this.uid}.img`)
        await uploadBytes(storageRef, this.image).then((snapshot) => {
          console.log('Uploaded a blob or file!')
        })
        this.getimgUrl()
        this.updateuserImg()
      }
    },
    // プロフィール画像のurlをthis.imgUrlに挿入
    getimgUrl() {
      const storage = getStorage()
      const gsReference = ref(
        storage,
        `gs://groupchat-a6478.appspot.com/${this.uid}/${this.uid}.img`
      )
      getDownloadURL(gsReference)
        .then((url) => {
          this.imgUrl = url
          this.updateuserImg()
          location.reload()
        })
        .catch((err) => console.log(err))
    },
    // firestoreの'user/imgUrl'をupdate
    async updateuserImg() {
      const db = getFirestore()
      const Ref = doc(db, 'users', this.uid)

      // To update age and favorite color:
      await updateDoc(Ref, {
        'user.imgUrl': this.imgUrl,
      })
    },
  },
}
</script>
<style scoped>
.mod {
  z-index: 2000;
}
.modal-dialog {
  padding: 0 5%;
}
</style>