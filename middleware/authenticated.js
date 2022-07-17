export default ({ store, redirect, route }) => {
    // ログインしていない場合ホームにリダイレクトします。
    if (!store.state.loggedIn) {
      return redirect({
        path: '/',
        query: {
          showMessage: true,
          redirect: route.path
        }
      })
    }
  }