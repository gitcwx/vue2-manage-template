const dicList = {
    userStatus: [
        { label: '正常', value: 1 },
        { label: '冻结', value: 2 }
    ],
    gender: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
    ]
}

function dictionary (value, dicName) {
    const item = dicList[dicName].find(v => v.value === value)
    return item ? item.label : '-'
}

module.exports = {
    ...dicList,
    dictionary
}
