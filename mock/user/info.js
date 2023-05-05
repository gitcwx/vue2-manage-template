export default Mock => {
  Mock.mock(
    /\/user\/info/,
    'post',
    options => {
      return {
        'code': 200,
        'msg': '查询成功',
        'data': {
          'lastLoginAt': '2023-04-24 15:09:45',
          'createdAt': '2021-08-06 14:57:28',
          'updatedAt': '2023-04-24 15:09:45',
          'id': '2fbf6fbf-b3c3-4f59-8d36-7ecb7c8bcf52',
          'username': 'admin',
          'nickname': '管理员',
          'gender': 0,
          'avatar': null,
          'phone': null,
          'idcard': '',
          'status': 1
        }
      }
    }
  )
}
