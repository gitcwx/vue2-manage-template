export default Mock => {
    Mock.mock(
        /\/user\/login/,
        'post',
        options => {
            return {
                'code': 's00',
                'msg': '登录成功',
                'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJmYmY2ZmJmLWIzYzMtNGY1OS04ZDM2LTdlY2I3YzhiY2Y1MiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2ODExNzc0ODIsImV4cCI6MTY4MTIwNjI4Mn0.Dc5zQfaMG7omudCl_Cj5ZQQ0SIapBflgjg5RxGVGzD4'
            }
        }
    )
}
