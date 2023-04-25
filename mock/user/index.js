import userLogin from './login.js'
import userInfo from './info.js'
import userList from './list.js'

export default Mock => {
    userLogin(Mock)
    userInfo(Mock)
    userList(Mock)
}
