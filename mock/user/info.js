export default Mock => {
  Mock.mock(
    /\/user\/info/,
    'post',
    options => {
      return {
        'code': 's00',
        'msg': '查询成功',
        'data': {
          'birth': null,
          'lastLoginAt': '2023-04-11 09:29:22',
          'createdAt': '2021-08-06 14:57:28',
          'updatedAt': '2023-04-11 09:29:22',
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
      }
    }
  )
}
