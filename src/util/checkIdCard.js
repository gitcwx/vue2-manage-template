const checkIdCard = (id) => {
    // 1 "通过", 0 // 不通过
    const format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
    // 号码规则校验
    if (!format.test(id)) {
        return { status: 0, msg: '身份号码不合规' }
    }

    // 出生年月日校验
    const year = id.slice(6, 10)
    const month = id.slice(10, 12)
    const date = id.slice(12, 14)
    if (
        // 2月30号 4月31号
        Number(date) > new Date(year, month, 0).getDate() ||
        // 今日之后
        new Date(`${year}/${month}/${date}`).getTime() > Date.now()
    ) {
        return { status: 0, msg: '出生日期不合规' }
    }
    // 校验码判断
    const c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 系数
    const b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码对照表
    let sum = 0
    for (let k = 0; k < 17; k++) {
        sum += parseInt(id[k]) * parseInt(c[k])
    }
    if (id[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
        return { status: 0, msg: '校验码不合规' }
    }
    return { status: 1, msg: '身份证校验通过' }
}

export default checkIdCard
