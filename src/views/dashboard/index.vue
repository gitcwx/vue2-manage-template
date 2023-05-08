<template>
    <div class="manage manage-dashboard">
        <div class="item">
            身份证号：<ui-input-idcard placeholder="请输入身份证号" />
        </div>

        <div class="item">
            <ui-digital v-model="text" color="#409EFF" shadowColor="rgba(64,158,255,.1)" size="30" />
        </div>

        <div class="item">
            自动计时器：
            <ui-timer
                type="counter"
                size="20"
                :autoRun="true"
                @onStep="time => counter1Runtime = time"
                :runStatus.sync="counter1RunStatus"
            />
            <span class="text-success">已运行 {{ counter1Runtime }} 秒</span>
            <el-button size="mini" type="primary" @click="counter1RunStatus = true" v-if="!counter1RunStatus">开始计时</el-button>
            <el-button size="mini" type="danger" @click="counter1RunStatus = false" v-else>暂停计时</el-button>
        </div>
        <div class="item">
            自动倒计时：
            <ui-timer
                type="countdown"
                size="1.5rem"
                v-model="counter2"
                :autoRun="true"
                :runStatus.sync="counter2RunStatus"
                @onEnd="counter2IsEnd = true"
            />
            <span class="text-danger">{{ counter2IsEnd ? '时间到' : '' }}</span>
            <el-button size="mini" type="primary" @click="counter2RunStatus = true" v-if="!counter2RunStatus">开始倒计时</el-button>
            <el-button size="mini" type="danger" @click="counter2RunStatus = false" v-else>暂停倒计时</el-button>
        </div>
        <div class="item">
            手动倒计时：
            <ui-timer
                type="countdown"
                size="2rem"
                v-model="counter3"
                :runStatus.sync="counter3RunStatus"
            />
            <el-button size="mini" type="primary" @click="counter3RunStatus = true" v-if="!counter3RunStatus">开始倒计时</el-button>
            <el-button size="mini" type="danger" @click="counter3RunStatus = false" v-else>暂停倒计时</el-button>
        </div>
        <div class="item">
            当前时间：
            <ui-timer type="time" />
        </div>
        <div class="item">
            当前日期时间：
            <ui-timer type="dateTime" />
        </div>

        <div class="item">
            <ui-tips text="标题1" />
        </div>
        <div class="item">
            <ui-tips text="标题2" type="success">
                <template slot="right">
                    <el-button size="mini" type="primary">测试</el-button>
                </template>
            </ui-tips>
        </div>
        <div class="item">
            <ui-tips text="标题3" type="danger" />
        </div>
        <div class="item">
            <ui-tips text="标题4" type="warning" />
        </div>
        <div class="item">
            <ui-tips text="标题5" type="info" />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'manage-dashboard',
        data () {
            return {
                text: '数码字 / 12345 / ABCDE / abcde',
                counter1Runtime: 0,
                counter1RunStatus: false,
                counter2: 10,
                counter2RunStatus: false,
                counter2IsEnd: false,
                counter3: '2h15m36s',
                counter3RunStatus: false
            }
        },
        methods: {
        }
    }
</script>

<style lang="scss" scoped>
.item {
    width: 500px;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    white-space: nowrap;
}
</style>>
