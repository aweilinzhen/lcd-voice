/* =====================================
   DOM
===================================== */

const statusBar =
    document.getElementById("statusBar");

const batteryStatus =
    document.getElementById("batteryStatus");

const batteryFill =
    document.getElementById("batteryFill");

const batteryText =
    document.getElementById("batteryText");

const bluetoothIcon =
    document.getElementById("bluetoothIcon");

const extraIcon =
    document.getElementById("extraIcon");

const qrCode =
    document.getElementById("qrCode");

const loadingIcon =
    document.getElementById("loadingIcon");

const successIcon =
    document.getElementById("successIcon");

const failIcon =
    document.getElementById("failIcon");

const markIcon =
    document.getElementById("markIcon");

const updateIcon =
    document.getElementById("updateIcon");

const wave =
    document.getElementById("wave");

const line1 =
    document.getElementById("line1");

const line2 =
    document.getElementById("line2");

const progressArea =
    document.getElementById("progressArea");

const progressText =
    document.getElementById("progressText");

const progressFill =
    document.getElementById("progressFill");

const led =
    document.getElementById("led");


let stateTimer = null;


/* =====================================
   电池
===================================== */

function setBattery(percent, color = "green") {

    batteryText.textContent =
        percent + "%";

    batteryFill.style.width =
        percent + "%";

    batteryFill.classList.remove(
        "green",
        "red",
        "orange"
    );

    batteryFill.classList.add(
        color
    );

}


/* =====================================
   重置 LCD
===================================== */

function resetLCD() {

    if (stateTimer) {
        clearTimeout(stateTimer);
        stateTimer = null;
    }


    /* 恢复顶部状态栏 */

    statusBar.classList.remove(
        "hidden"
    );

    batteryStatus.classList.remove(
        "hidden"
    );

    bluetoothIcon.classList.remove(
        "hidden",
        "orange"
    );


    /* 隐藏其他元素 */

    extraIcon.classList.add(
        "hidden"
    );

    qrCode.classList.add(
        "hidden"
    );

    loadingIcon.classList.add(
        "hidden"
    );

    successIcon.classList.add(
        "hidden"
    );

    failIcon.classList.add(
        "hidden"
    );

    markIcon.classList.add(
        "hidden"
    );

    updateIcon.classList.add(
        "hidden"
    );

    wave.classList.add(
        "hidden"
    );

    progressArea.classList.add(
        "hidden"
    );


    /* 清除传输布局 */

    progressArea.classList.remove(
        "wifi-transfer-layout",
        "ble-transfer-layout"
    );


    /* 重置进度条 */

    progressFill.classList.remove(
        "cyan"
    );

    progressFill.style.width =
        "0%";

    progressText.textContent =
        "";


    /* 停止充电动画 */

    batteryFill.classList.remove(
        "charging-animation"
    );


    /* 清空文字 */

    line1.textContent =
        "";

    line2.textContent =
        "";


    /* 清除文字颜色 */

    line1.classList.remove(
        "text-red",
        "text-yellow",
        "text-blue",
        "text-cyan",
        "text-green"
    );

    line2.classList.remove(
        "text-red",
        "text-yellow",
        "text-blue",
        "text-cyan",
        "text-green"
    );


    /* LED 默认关闭 */

    led.classList.remove(
        "recording"
    );


    /* 默认电量 */

    setBattery(
        85,
        "green"
    );

}


/* =====================================
   LCD 完全熄灭
===================================== */

function showNoDisplay() {

    statusBar.classList.add(
        "hidden"
    );

    batteryStatus.classList.add(
        "hidden"
    );

    bluetoothIcon.classList.add(
        "hidden"
    );

    extraIcon.classList.add(
        "hidden"
    );

    qrCode.classList.add(
        "hidden"
    );

    loadingIcon.classList.add(
        "hidden"
    );

    successIcon.classList.add(
        "hidden"
    );

    failIcon.classList.add(
        "hidden"
    );

    markIcon.classList.add(
        "hidden"
    );

    updateIcon.classList.add(
        "hidden"
    );

    wave.classList.add(
        "hidden"
    );

    progressArea.classList.add(
        "hidden"
    );

    line1.textContent =
        "";

    line2.textContent =
        "";

    progressText.textContent =
        "";

}


/* =====================================
   录音显示
===================================== */

function showRecording() {

    wave.classList.remove(
        "hidden"
    );

    line1.textContent =
        "录音中";

    line2.textContent =
        "00:23:18";

    led.classList.add(
        "recording"
    );

}


/* =====================================
   状态切换
===================================== */

function setState(state) {

    resetLCD();


    switch (state) {


        /* =================================
           设备状态
        ================================= */

        case "firstBoot":

            statusBar.classList.add(
                "hidden"
            );

            batteryStatus.classList.add(
                "hidden"
            );

            bluetoothIcon.classList.add(
                "hidden"
            );

            qrCode.classList.remove(
                "hidden"
            );

            line1.textContent =
                "请打开App连接设备";

            break;



        case "deviceConnecting":

            batteryStatus.classList.add(
                "hidden"
            );

            bluetoothIcon.classList.add(
                "hidden"
            );

            loadingIcon.classList.remove(
                "hidden"
            );

            line1.textContent =
                "连接中";

            break;



        case "deviceConnected":

            batteryStatus.classList.add(
                "hidden"
            );

            bluetoothIcon.classList.add(
                "hidden"
            );

            successIcon.classList.remove(
                "hidden"
            );

            line1.textContent =
                "连接成功";

            stateTimer =
                setTimeout(() => {

                    setState(
                        "idle"
                    );

                }, 5000);

            break;



        case "deviceConnectFail":

            batteryStatus.classList.add(
                "hidden"
            );

            bluetoothIcon.classList.add(
                "hidden"
            );

            failIcon.classList.remove(
                "hidden"
            );

            line1.textContent =
                "连接失败";

            line1.classList.add(
                "text-red"
            );

            break;



        case "shutdown":

            line1.textContent =
                "正在关机中";

            break;



        /* =================================
           录音状态
        ================================= */

        case "idle":

            line1.textContent =
                "○";

            line2.textContent =
                "就绪";

            break;



        case "recordStart":

            showRecording();

            stateTimer =
                setTimeout(() => {

                    showNoDisplay();

                    led.classList.add(
                        "recording"
                    );

                }, 5000);

            break;



        case "recording":

            showRecording();

            stateTimer =
                setTimeout(() => {

                    showNoDisplay();

                    led.classList.add(
                        "recording"
                    );

                }, 5000);

            break;



        case "recordPause":

            line1.textContent =
                "暂停中";

            line2.textContent =
                "00:23:18";

            break;



        case "recordEnd":

            line1.textContent =
                "结束录音";

            break;



        case "mark":

            markIcon.classList.remove(
                "hidden"
            );

            line1.textContent =
                "已标记";

            led.classList.add(
                "recording"
            );

            break;



        case "recordFail":

            line1.textContent =
                "录音失败";

            line1.classList.add(
                "text-red"
            );

            break;



        /* =================================
           电量状态
        ================================= */

        case "batteryLow":

            setBattery(
                18,
                "red"
            );

            line1.textContent =
                "电量不足，请充电";

            line1.classList.add(
                "text-red"
            );

            break;



        case "batteryCritical":

            setBattery(
                8,
                "red"
            );

            line1.textContent =
                "电量不足";

            line2.textContent =
                "无法录音";

            line1.classList.add(
                "text-red"
            );

            line2.classList.add(
                "text-red"
            );

            break;



        case "charging":

            bluetoothIcon.classList.add(
                "hidden"
            );

            setBattery(
                65,
                "green"
            );

            batteryFill.classList.add(
                "charging-animation"
            );

            break;



        case "charged":

            bluetoothIcon.classList.add(
                "hidden"
            );

            setBattery(
                100,
                "green"
            );

            break;



        /* =================================
           蓝牙状态
        ================================= */

        case "btWaiting":

            statusBar.classList.add(
                "hidden"
            );

            batteryStatus.classList.add(
                "hidden"
            );

            bluetoothIcon.classList.add(
                "hidden"
            );

            qrCode.classList.remove(
                "hidden"
            );

            line1.textContent =
                "请打开App连接设备";

            break;



        case "btConnecting":

            batteryStatus.classList.add(
                "hidden"
            );

            bluetoothIcon.classList.add(
                "hidden"
            );

            loadingIcon.classList.remove(
                "hidden"
            );

            line1.textContent =
                "连接中";

            break;



        case "btConnected":

            batteryStatus.classList.add(
                "hidden"
            );

            bluetoothIcon.classList.add(
                "hidden"
            );

            successIcon.classList.remove(
                "hidden"
            );

            line1.textContent =
                "连接成功";

            stateTimer =
                setTimeout(() => {

                    setState(
                        "idle"
                    );

                }, 5000);

            break;



        case "btDisconnected":

            bluetoothIcon.classList.add(
                "orange"
            );

            line1.textContent =
                "蓝牙已断开";

            line1.classList.add(
                "text-yellow"
            );

            stateTimer =
                setTimeout(() => {

                    line1.textContent =
                        "未连接";

                    line1.classList.remove(
                        "text-yellow"
                    );

                }, 5000);

            break;



        /* =================================
           数据传输状态
        ================================= */

        case "bleTransfer":

            /*
             * 蓝牙传输
             *
             * 第一行：
             * 正在传输  65%
             *
             * 第二行：
             * 进度条
             */

            line1.textContent =
                "";

            line2.textContent =
                "";

            progressArea.classList.remove(
                "hidden"
            );

            progressArea.classList.add(
                "ble-transfer-layout"
            );

            progressText.textContent =
                "正在传输  65%";

            progressFill.style.width =
                "65%";

            break;



        case "wifiWaiting":

            line1.textContent =
                "Wi-Fi待连接";

            line1.classList.add(
                "text-cyan"
            );

            break;



        case "wifiConnected":

            line1.textContent =
                "Wi-Fi已连接";

            line1.classList.add(
                "text-cyan"
            );

            break;



        case "wifiTransfer":

            /*
             * Wi-Fi传输
             *
             * 第一行：
             * Wi-Fi高速传输  80%
             *
             * 第二行：
             * 进度条
             */

            line1.textContent =
                "";

            line2.textContent =
                "";

            progressArea.classList.remove(
                "hidden"
            );

            progressArea.classList.add(
                "wifi-transfer-layout"
            );

            progressText.textContent =
                "Wi-Fi高速传输  80%";

            progressFill.classList.add(
                "cyan"
            );

            progressFill.style.width =
                "80%";

            break;



        /* =================================
           存储状态
        ================================= */

        case "storageLow":

            line1.textContent =
                "存储不足";

            line2.textContent =
                "剩余 * 小时";

            line1.classList.add(
                "text-yellow"
            );

            break;



        case "storageFull":

            line1.textContent =
                "存储已满";

            line2.textContent =
                "无法录音";

            line1.classList.add(
                "text-yellow"
            );

            line2.classList.add(
                "text-yellow"
            );

            break;



        /* =================================
           系统状态
        ================================= */

        case "systemError":

            line1.textContent =
                "设备异常";

            line1.classList.add(
                "text-red"
            );

            break;



        /* =================================
           OTA升级
        ================================= */

        case "updating":

            statusBar.classList.add(
                "hidden"
            );

            batteryStatus.classList.add(
                "hidden"
            );

            bluetoothIcon.classList.add(
                "hidden"
            );

            updateIcon.classList.remove(
                "hidden"
            );

            progressArea.classList.remove(
                "hidden"
            );

            progressText.textContent =
                "升级中 65%";

            progressFill.style.width =
                "65%";

            break;



        case "updateFail":

            statusBar.classList.add(
                "hidden"
            );

            batteryStatus.classList.add(
                "hidden"
            );

            bluetoothIcon.classList.add(
                "hidden"
            );

            line1.textContent =
                "升级失败";

            line2.textContent =
                "请重新连接App";

            line1.classList.add(
                "text-red"
            );

            break;



        /* =================================
           LED状态
        ================================= */

        case "ledRecording":

            /*
             * LCD完全黑屏
             * 只亮右侧红色LED
             */

            showNoDisplay();

            led.classList.add(
                "recording"
            );

            break;

    }

}


/* =====================================
   按钮点击事件
===================================== */

document
    .querySelectorAll(
        "button[data-state]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                setState(
                    button.dataset.state
                );

            }
        );

    });


/* =====================================
   默认状态
===================================== */

setState(
    "idle"
);