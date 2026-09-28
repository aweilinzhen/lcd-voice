const statusBar = document.getElementById("statusBar");
const batteryStatus = document.getElementById("batteryStatus");
const batteryFill = document.getElementById("batteryFill");
const batteryText = document.getElementById("batteryText");
const bluetoothIcon = document.getElementById("bluetoothIcon");
const extraIcon = document.getElementById("extraIcon");

const qrCode = document.getElementById("qrCode");
const loadingIcon = document.getElementById("loadingIcon");
const successIcon = document.getElementById("successIcon");
const failIcon = document.getElementById("failIcon");
const markIcon = document.getElementById("markIcon");
const updateIcon = document.getElementById("updateIcon");

const wave = document.getElementById("wave");

const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");

const progressArea = document.getElementById("progressArea");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const led = document.getElementById("led");

const lcd = document.querySelector(".lcd");

let stateTimer = null;


/* =========================================================
   电池
========================================================= */

function setBattery(percent, color = "green") {

    batteryText.textContent = percent + "%";

    batteryFill.style.width = percent + "%";

    batteryFill.classList.remove(
        "green",
        "red",
        "orange"
    );

    batteryFill.classList.add(color);
}


/* =========================================================
   LCD 重置
========================================================= */

function resetLCD() {

    if (stateTimer) {
        clearTimeout(stateTimer);
        stateTimer = null;
    }


    /* 清除录音横向布局 */

    if (lcd) {
        lcd.classList.remove(
            "recording-layout"
        );
    }


    /* 状态栏 */

    statusBar.classList.remove("hidden");

    batteryStatus.classList.remove("hidden");

    bluetoothIcon.classList.remove(
        "hidden",
        "orange"
    );

    extraIcon.classList.add("hidden");


    /* 中央状态图标 */

    qrCode.classList.add("hidden");

    loadingIcon.classList.add("hidden");

    successIcon.classList.add("hidden");

    failIcon.classList.add("hidden");

    markIcon.classList.add("hidden");

    updateIcon.classList.add("hidden");


    /* 波形 */

    wave.classList.add("hidden");


    /* 进度条 */

    progressArea.classList.add("hidden");

    progressArea.classList.remove(
        "wifi-transfer-layout",
        "ble-transfer-layout"
    );

    progressFill.classList.remove("cyan");

    progressFill.style.width = "0%";

    progressText.textContent = "";


    /* 充电动画 */

    batteryFill.classList.remove(
        "charging-animation"
    );


    /* LCD文字 */

    line1.textContent = "";

    line2.textContent = "";

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


    /* LED */

    led.classList.remove("recording");


    /* 默认电量 */

    setBattery(85, "green");
}


/* =========================================================
   LCD完全熄屏
========================================================= */

function showNoDisplay() {

    if (lcd) {
        lcd.classList.remove(
            "recording-layout"
        );
    }

    statusBar.classList.add("hidden");

    batteryStatus.classList.add("hidden");

    bluetoothIcon.classList.add("hidden");

    extraIcon.classList.add("hidden");

    qrCode.classList.add("hidden");

    loadingIcon.classList.add("hidden");

    successIcon.classList.add("hidden");

    failIcon.classList.add("hidden");

    markIcon.classList.add("hidden");

    updateIcon.classList.add("hidden");

    wave.classList.add("hidden");

    progressArea.classList.add("hidden");

    line1.textContent = "";

    line2.textContent = "";

    progressText.textContent = "";
}


/* =========================================================
   录音中
========================================================= */

function showRecording() {

    /*
     * 新版横向布局：
     *
     * 录音中 | 动态波形 | 00:23:18
     */

    if (lcd) {
        lcd.classList.add(
            "recording-layout"
        );
    }


    /* 顶部状态栏 */

    statusBar.classList.remove("hidden");

    batteryStatus.classList.remove("hidden");

    bluetoothIcon.classList.remove("hidden");


    /* 动态波形 */

    wave.classList.remove("hidden");


    /* 左侧录音状态 */

    line1.textContent = "录音中";


    /* 右侧录音时间 */

    line2.textContent = "00:23:18";


    /* 红色录音灯 */

    led.classList.add("recording");
}


/* =========================================================
   状态控制
========================================================= */

function setState(state) {

    resetLCD();

    switch (state) {


        /* =================================================
           设备状态
        ================================================= */


        /* 首次开机 */

        case "firstBoot":

            statusBar.classList.add("hidden");

            batteryStatus.classList.add("hidden");

            bluetoothIcon.classList.add("hidden");

            qrCode.classList.remove("hidden");

            line1.textContent = "请打开App连接设备";

            break;


        /* 连接中 */

        case "deviceConnecting":

            batteryStatus.classList.add("hidden");

            bluetoothIcon.classList.add("hidden");

            loadingIcon.classList.remove("hidden");

            line1.textContent = "连接中";

            break;


        /* 连接成功 */

        case "deviceConnected":

            batteryStatus.classList.add("hidden");

            bluetoothIcon.classList.add("hidden");

            successIcon.classList.remove("hidden");

            line1.textContent = "连接成功";

            stateTimer = setTimeout(
                () => setState("idle"),
                5000
            );

            break;


        /* 连接失败 */

        case "deviceConnectFail":

            batteryStatus.classList.add("hidden");

            bluetoothIcon.classList.add("hidden");

            failIcon.classList.remove("hidden");

            line1.textContent = "连接失败";

            line1.classList.add("text-red");

            break;


        /* 关机 */

        case "shutdown":

            line1.textContent = "正在关机中";

            break;


        /* =================================================
           录音状态
        ================================================= */


        /* 待机 */

        case "idle":

            line1.textContent = "○";

            line2.textContent = "就绪";

            break;


        /* 录音启动 */

        case "recordStart":

            showRecording();

            stateTimer = setTimeout(
                () => {

                    showNoDisplay();

                    led.classList.add(
                        "recording"
                    );

                },
                5000
            );

            break;


        /* 录音中 */

        case "recording":

            showRecording();

            stateTimer = setTimeout(
                () => {

                    showNoDisplay();

                    led.classList.add(
                        "recording"
                    );

                },
                5000
            );

            break;


        /* 暂停录音 */

        case "recordPause":

            line1.textContent = "暂停中";

            line2.textContent = "00:23:18";

            break;


        /* 录音结束 */

        case "recordEnd":

            line1.textContent = "结束录音";

            break;


        /* 标记 */

        case "mark":

            markIcon.classList.remove(
                "hidden"
            );

            line1.textContent = "已标记";

            led.classList.add(
                "recording"
            );

            break;


        /* 录音失败 */

        case "recordFail":

            failIcon.classList.remove(
                "hidden"
            );

            line1.textContent = "录音失败";

            line2.textContent = "";

            line1.classList.add(
                "text-red"
            );

            break;


        /* =================================================
           电量状态
        ================================================= */


        /* 低电量 */

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


        /* 极低电量 */

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


        /* 充电中 */

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


        /* 充满电 */

        case "charged":

            bluetoothIcon.classList.add(
                "hidden"
            );

            setBattery(
                100,
                "green"
            );

            break;


        /* =================================================
           蓝牙连接
        ================================================= */


        /* 待连接 */

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


        /* 蓝牙连接中 */

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


        /* 蓝牙已连接 */

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

            stateTimer = setTimeout(
                () => setState("idle"),
                5000
            );

            break;


        /* 蓝牙断开 */

        case "btDisconnected":

            bluetoothIcon.classList.add(
                "orange"
            );

            line1.textContent =
                "蓝牙已断开";

            line1.classList.add(
                "text-yellow"
            );

            stateTimer = setTimeout(
                () => {

                    line1.textContent =
                        "未连接";

                    line1.classList.remove(
                        "text-yellow"
                    );

                },
                5000
            );

            break;


        /* =================================================
           数据传输
        ================================================= */


        /* 蓝牙传输 */

        case "bleTransfer":

            line1.textContent = "";

            line2.textContent = "";

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


        /* Wi-Fi待连接 */

        case "wifiWaiting":

            line1.textContent =
                "Wi-Fi待连接";

            line1.classList.add(
                "text-cyan"
            );

            break;


        /* Wi-Fi已连接 */

        case "wifiConnected":

            line1.textContent =
                "Wi-Fi已连接";

            line1.classList.add(
                "text-cyan"
            );

            break;


        /* Wi-Fi传输 */

        case "wifiTransfer":

            line1.textContent = "";

            line2.textContent = "";

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


        /* =================================================
           存储状态
        ================================================= */


        /* 存储不足 */

        case "storageLow":

            line1.textContent =
                "存储不足";

            line2.textContent =
                "剩余 * 小时";

            line1.classList.add(
                "text-yellow"
            );

            break;


        /* 存储满 */

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


        /* =================================================
           系统状态
        ================================================= */


        /* 设备异常 */

        case "systemError":

            line1.textContent =
                "设备异常";

            line1.classList.add(
                "text-red"
            );

            break;


        /* =================================================
           OTA升级
        ================================================= */


        /* 升级中 */

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


        /* 升级失败 */

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

            failIcon.classList.remove(
                "hidden"
            );

            line1.textContent =
                "升级失败";

            line2.textContent = "";

            line1.classList.add(
                "text-red"
            );

            break;


        /* =================================================
           LED状态
        ================================================= */


        /* 录音红灯 */

        case "ledRecording":

            /*
             * LCD完全黑屏
             * 只保留右侧红色LED
             */

            showNoDisplay();

            led.classList.add(
                "recording"
            );

            break;

    }

}


/* =========================================================
   右侧状态按钮
   Hover + 点击后持续选中
========================================================= */

const stateButtons = document.querySelectorAll(
    "button[data-state]"
);

stateButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            /*
             * 清除所有按钮选中状态
             */

            stateButtons.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            /*
             * 当前按钮保持选中
             */

            button.classList.add(
                "active"
            );


            /*
             * 切换 LCD 状态
             */

            setState(
                button.dataset.state
            );

        }
    );

});


/* =========================================================
   默认状态
========================================================= */

setState("idle");