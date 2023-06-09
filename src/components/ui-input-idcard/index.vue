<template>
    <div class="ui-input-idcard">
        <el-input
            v-bind="$attrs"
            v-model="current"
            maxlength="18"
            @input="onInput"
            @blur="onBlur"
            @change="onChange"
        />
        <div class="ui-input-idcard-popover" v-if="showTips">
            <span
                v-for="(item, index) in tips"
                :key="index"
                :class="item.status"
            >{{ item.text }}</span>
        </div>
    </div>
</template>

<script>
    const c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 系数
    const b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码对照表
    const reg = [
        // 省
        '[1-8]', '(((?<=1)[1-5])|((?<=2)[1-3])|((?<=3)[1-7])|((?<=4)[1-6])|((?<=5)[0-4])|((?<=6)[1-5])|((?<=7)[1])|((?<=8)[1-2]))',
        // 市
        '[0-9]', '[0-9]',
        // 县
        '[0-9]', '[0-9]',
        // 年份
        '[12]', '(((?<=1)9)|((?<=2)[0-9]))', '[0-9]', '[0-9]',
        // 月份
        '[01]', '(((?<=0)[1-9])|((?<=1)[012]))',
        // 日期
        '[0-3]', '(((?<=0)[1-9])|((?<=[12])[0-9])|((?<=3)[01]))',
        // 派出所
        '[0-9]', '[0-9]',
        // 性别
        '[0-9]',
        // 校验码
        '[0-9xX]'
    ]
    export default {
        name: 'ui-input-idcard',
        props: {
            value: [Number, String]
        },
        data () {
            return {
                current: '',
                tips: [],
                showTips: false
            }
        },
        watch: {
            value: {
                immediate: true,
                handler (newVal) {
                    this.current = this.formatValue(newVal)
                }
            }
        },
        methods: {
            // 限定只能输入数字和X
            formatValue (val) {
                return val ? val.replace(/[^0-9xX]/g, '').replace(/x$/, 'X') : ''
            },
            onInput (val) {
                this.current = this.formatValue(val)
                this.$emit('input', this.current)
                if (this.current) {
                    this.checkVal()
                    this.showTips = true
                } else {
                    this.showTips = false
                }
            },
            onBlur (event) {
                this.showTips = false
                this.$emit('blur', event)
                // 移除失焦回填 无法触发校验
            },
            onChange (val) {
                this.$emit('change', val)
            },
            checkVal () {
                this.tips = []
                const len = Math.min(this.current.length, 17)
                let allPass = true
                // 校验前17位
                for (let i = 0; i < len; i++) {
                    const item = this.current[i]
                    let status
                    // 有先行断言的，带上前面字符一起过校验
                    if (reg[i].indexOf('?<=') > -1) {
                        const prev = this.current[i - 1]
                        status = new RegExp(reg[i - 1] + reg[i]).test(prev + item)
                    } else {
                        status = new RegExp(reg[i]).test(item)
                    }
                    // 正则过了再校验日期是否在今日之前
                    if (status) {
                        status = this.isBeforeToday(i)
                    }
                    // 记录是否全部正确
                    if (!status) {
                        allPass = false
                    }
                    this.tips.push({
                        text: item,
                        status: status ? 'pass' : 'fail'
                    })
                }

                if (this.current.length < 17) { return }
                // 输入第17位时 自动补全提示
                const lastChar = this.getLastChar()
                if (this.current.length === 17 && allPass) {
                    this.tips[17] = { text: lastChar, status: '' }
                    return
                }
                if (this.current.length < 18) { return }
                // 输入第18位时 校验位检测
                this.tips[17] = {
                    text: this.current[17],
                    status: allPass ? this.current[17].toUpperCase() === lastChar ? 'pass' : 'fail' : ''
                }
            },
            // 年份补全
            fixYear (index) {
                // 年份不能超过4位数
                index = Math.min(index, 9)
                return this.current.slice(6, index + 1) + '000'.slice(index - 6)
            },
            // 月份/日期补全
            fixDate (index, start) {
                let date
                if (index < start) {
                    date = '01'
                } else if (index === start) {
                    date = this.current.slice(start, start + 1)
                    date += date === '0' ? '1' : '0'
                } else {
                    date = this.current.slice(start, start + 2)
                }
                return date
            },
            // 判断今日之前
            isBeforeToday (index) {
                if (index < 7 || index > 13) { return true }
                const year = this.fixYear(index)
                const month = this.fixDate(index, 10)
                const date = this.fixDate(index, 12)
                // 2月30号 4月31号
                if (Number(date) > new Date(year, month, 0).getDate()) {
                    return false
                }
                return new Date(`${year}/${month}/${date}`).getTime() <= Date.now()
            },
            // 获取校验位
            getLastChar () {
                if (this.current.length < 17) { return }
                let sum = 0
                for (let k = 0; k < 17; k++) {
                    sum += this.current[k] * c[k]
                }
                return b[sum % 11].toUpperCase()
            }
        }
    }
</script>

<style lang="scss" scoped>
.ui-input-idcard {
    position: relative;
    display: inline-block;
    vertical-align: top;
    width: 100%;

    .ui-input-idcard-popover {
        position: absolute;
        top: 50px;
        left: 0;
        z-index: 9999;
        background-color: #e5f6ff;
        color: #ff9900;
        border: 1px solid #33ccff;
        font-size: 18px;
        padding: 0 15px;
        height: 42px;
        line-height: 40px;
        font-weight: bold;
        white-space: nowrap;
        letter-spacing: 1px;

        span {
            &.fail {
                color: #f00;
            }
            &.pass {
                color: #1dc043;
            }
            &:nth-child(7) {
                margin-left: 6px;
            }
            &:nth-child(14) {
                margin-right: 6px;
            }
        }
    }
}
</style>
