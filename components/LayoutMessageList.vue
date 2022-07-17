<template>
  <div>
    <div class="message-template">
      <!-- 受信メッセージのテンプレート -->
      <div v-if="item.logoutUser" class="message message--received">
        <div class="message__profile">
          <div v-if="item.userImg">
            <img
              class="message__user-image"
              :src="item.userImg"
              width="46"
              height="46"
              alt="プロフィール画像img"
            />
          </div>
          <div v-else>
            <img
              class="message__user-image"
              src="~/assets/images/default-profile-image.png"
              width="46"
              height="46"
              alt="プロフィール画像defolt"
            />
          </div>
        </div>
        <div class="message__body">
          <div class="message__user-name">{{ item.nickName }}</div>
          <div class="message__text">{{ item.text }}</div>
          <div class="message__info">
            <span class="message__time">{{ item.time }}</span>
          </div>
        </div>
      </div>

      <!-- /.message -->

      <!-- 送信メッセージのテンプレート -->
      <div v-else class="message message--sent">
        <div class="message__profile">
          <div v-if="item.userImg">
            <img
              class="message__user-image"
              :src="item.userImg"
              width="46"
              height="46"
              alt="プロフィール画像"
            />
          </div>
          <div v-else>
            <img
              class="message__user-image"
              src="~/assets/images/default-profile-image.png"
              width="46"
              height="46"
              alt="プロフィール画像defolt"
            />
          </div>
        </div>
        <div class="message__body">
          <div class="message__user-name">{{ item.nickName }}</div>
          <div class="message__text">{{ item.text }}</div>
          <div class="message__info">
            <span class="message__time">{{ item.time }}</span>
          </div>
        </div>
      </div>

      <!-- /.message -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'LayoutMessageList',
  props: {
    item: {
      type: Object,
    },
  },
}
</script>
<style scoped>
.message-template {
  display: block;
}

.message {
  clear: both;
}

.message__user-name {
  font-size: 0.8rem;
}

.message__body {
  position: relative;
  width: 75%;
  max-width: 400px;
  margin-bottom: 10px;
  padding: 8px;
  background-color: #e7e7e7;
}

.message__text {
  font-size: 1rem;
  font-weight: bold;
}

.message__info {
  text-align: right;
}

.message__time {
  font-size: 0.8rem;
  color: #787878;
}

.message--received .message__body {
  background-color: #e7e7e7;
}

.message--sent .message__body {
  background-color: #d9f3d8;
}

.message--received .message__profile,
.message--received .message__body {
  float: left;
}

.message--sent .message__profile,
.message--sent .message__body {
  float: right;
}

.message--received .message__profile {
  margin-right: 18px;
}

.message--sent .message__profile {
  margin-left: 18px;
}

.message--received .message__body {
  border-radius: 0 6px 6px 6px;
}

/* 三角形の耳 */
.message--received .message__body:before {
  position: absolute;
  top: 0;
  left: -10px;
  content: ' ';
  border-width: 10px 0 0 10px;
  border-style: solid;
  border-color: #e7e7e7 transparent;
}

.message--sent .message__body {
  border-radius: 6px 0 6px 6px;
}

/* 三角形の耳 */
.message--sent .message__body:after {
  position: absolute;
  top: 0;
  right: -10px;
  content: ' ';
  border-width: 10px 10px 0 0;
  border-style: solid;
  border-color: #d9f3d8 transparent;
}
</style>