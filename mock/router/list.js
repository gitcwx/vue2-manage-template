export default Mock => {
    Mock.mock(
        /\/router\/list/,
        'post',
        options => {
            return {
                'code': 200,
                'msg': '查询成功',
                'data': [
                    {
                        'createdAt': '2021-08-19 17:36:37',
                        'updatedAt': '2021-12-09 14:32:51',
                        'id': 'b36cde97-481d-4997-881e-676ad582977e',
                        'isMenu': true,
                        'name': 'dashboard',
                        'text': '控制台',
                        'icon': 'icon-home',
                        'parentMenuId': ''
                    },
                    {
                        'createdAt': '2021-08-25 15:13:05',
                        'updatedAt': '2021-12-09 14:33:48',
                        'id': '0303536c-13bb-4f6b-acce-669e5eb844a5',
                        'isMenu': true,
                        'name': 'user',
                        'text': '用户管理',
                        'icon': 'icon-team',
                        'parentMenuId': ''
                    },
                    {
                        'createdAt': '2021-08-25 15:13:05',
                        'updatedAt': '2021-12-09 14:33:48',
                        'id': '05217464-0bc7-47ec-9167-df5d23fe9f7f',
                        'isMenu': true,
                        'name': 'user.list',
                        'text': '用户列表',
                        'icon': 'icon-user',
                        'parentMenuId': '0303536c-13bb-4f6b-acce-669e5eb844a5'
                    },
                    {
                        'createdAt': '2021-08-27 15:17:47',
                        'updatedAt': '2021-12-09 14:34:24',
                        'id': '12cb39ba-2002-4839-8570-f7ed9e37825e',
                        'isMenu': false,
                        'name': 'user.password',
                        'text': '修改密码',
                        'icon': '',
                        'parentMenuId': '0303536c-13bb-4f6b-acce-669e5eb844a5'
                    }
                ],
                'total': 4
            }
        }
    )
}
