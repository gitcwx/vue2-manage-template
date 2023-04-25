export default Mock => {
    Mock.mock(
      /\/user\/list/,
      'post',
      options => {
        return {
            'code': 's00',
            'msg': '查询成功',
            'data': [
              {
                'birth': null,
                'lastLoginAt': '2023-04-24 16:55:36',
                'createdAt': '2023-04-24 16:55:36',
                'updatedAt': '2023-04-24 16:55:36',
                'id': '47d3596e-eb7b-4a6f-bc5e-ab226d26a21b',
                'username': 'test',
                'nickname': '测试',
                'motto': null,
                'gender': 1,
                'location': null,
                'avatar': null,
                'email': null,
                'phone': '13333333333',
                'status': 1,
                'from': 0
              },
              {
                'birth': null,
                'lastLoginAt': '2023-04-24 15:09:45',
                'createdAt': '2021-08-06 14:57:28',
                'updatedAt': '2023-04-24 15:09:45',
                'id': '2fbf6fbf-b3c3-4f59-8d36-7ecb7c8bcf52',
                'username': 'admin',
                'nickname': '管理员',
                'motto': null,
                'gender': 0,
                'location': '',
                'avatar': null,
                'email': null,
                'phone': null,
                'status': 1,
                'from': 0
              }
            ],
            'total': 2
          }
      }
    )
  }
