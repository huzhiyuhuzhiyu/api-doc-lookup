<script>
export default {
    name: "FinishSubmit",
    data(){
        return{
            reCreateShow: false
        }
    },
    created() {
        setTimeout(() => {
            this.reCreateShow = true
        }, 2000)
    },
    props:{
        leftBtnText:{
            type: String,
            default: '再传一个'
        },
        rightBtnText:{
            type: String,
            default: '前往编辑'
        },
        background:{
            type: String,
            default: '#fff'
        }

    }
}
</script>

<template>
    <div class="height-full width-full flex-row justify-center align-center" :style="{background:background} ">
        <div class="background">
            <input checked type="checkbox" id="button">
            <!--        <label for="button" class="button">-->
            <!--            点击按钮<i class="iconfont icon-check"></i>-->
            <!--        </label>-->
            <svg class="circle">
                <circle cx="32" cy="32" r="31"></circle>
            </svg>
            <transition  name="el-zoom-in-center">
                <div v-if="reCreateShow" class="flex-column justify-center align-center">
                    <i class="el-icon el-icon-circle-check" style="font-size: 47px;color: #0eac5c"></i>
                    <div  style="margin-top: 10px">
                        <el-button type="primary" @click="$emit('left-btn-click')">{{ leftBtnText }}</el-button>
                        <el-button type="success" style="margin-left: 10px" @click="$emit('right-btn-click')">{{ rightBtnText }}</el-button>
                    </div>

                </div>

            </transition>

        </div>
    </div>

</template>

<style scoped lang="scss">

.background {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 400px;
    height: 400px;
    border-radius: 5px;
}

.background input {
    display: none;
}

.background .button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 260px;
    height: 60px;
    border: 2px solid rgb(33, 175, 231);
    border-radius: 30px;
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.background .button .icon-check {
    position: absolute;
    color: rgb(111, 119, 230);
    opacity: 0;
    font-size: 30px;
}

.background .circle {
    position: absolute;
    width: 65px;
    height: 65px;
    fill: none;
    stroke: rgb(33, 175, 231);
    stroke-width: 3px;
    stroke-dasharray: 183 183;
    opacity: 0;
    left: 50%;
    top: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%) rotate(-90deg);
}

.background .button:hover {
    background-color: rgb(135, 142, 235);
}

.background input:checked~ .button {
    animation: button 0.5s ease both,
    fill 0.5s ease-out 1.5s forwards;
}

@keyframes button {
    0% {
        width: 260px;
        left: 70px;
        border-color: rgb(33, 175, 231);
        color: white;
    }

    50% {
        color: transparent;
    }

    100% {
        width: 60px;
        left: 170px;
        border-color: rgb(33, 175, 231);
        background: transparent;
        color: transparent;
    }
}

@keyframes fill {
    0% {
        background: transparent;
        border-color: rgb(33, 175, 231);
    }

    100% {
        background: rgb(33, 175, 231);
    }
}

.background input:checked~.button .icon-check {
    animation: check 0.5s ease-out 1.5s both;
}

@keyframes check {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.background input:checked~.circle {
    animation: circle 2s ease-out 0.5s both;
}

@keyframes circle {
    0% {
        stroke-dashoffset: 183;
    }

    50% {
        stroke-dashoffset: 0;
        stroke-dasharray: 183;
        transform: translate(-50%, -50%) rotate(-90deg) scale(1);
        opacity: 1;
    }
    100% {
        stroke-dasharray: 500 500;
        transform: translate(-50%, -50%) rotate(-90deg) scale(2);
        opacity: 0;
    }
}
</style>
