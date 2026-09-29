const statusBar = document.getElementById("statusBar");
const batteryStatus = document.getElementById("batteryStatus");
const batteryFill = document.getElementById("batteryFill");
const batteryText = document.getElementById("batteryText");
const bluetoothIcon = document.getElementById("bluetoothIcon");
const extraIcon = document.getElementById("extraIcon");

const chargeDisplay = document.getElementById("chargeDisplay");
const chargeBatteryFill = document.getElementById("chargeBatteryFill");
const chargeBatteryValue = document.getElementById("chargeBatteryValue");

const qrCode = document.getElementById("qrCode");
const loadingIcon = document.getElementById("loadingIcon");
const successIcon = document.getElementById("successIcon");
const failIcon = document.getElementById("failIcon");

const recordEndIcon = document.getElementById("recordEndIcon");
const lcdRecordLight = document.getElementById("lcdRecordLight");

const markIcon = document.getElementById("markIcon");
const updateIcon = document.getElementById("updateIcon");

const wave = document.getElementById("wave");

const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");

const progressArea = document.getElementById("progressArea");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

/* 实体LED */
const led = document.getElementById("led");
const ledArea = document.getElementById("ledArea");

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


    /* 清除特殊布局 */

    if (lcd) {
        lcd.classList.remove(
            "recording-layout",
            "system-error-layout"
        );
    }


    /* =====================================================
       状态栏
    ====================================================== */

    statusBar.classList.remove("hidden");

    batteryStatus.classList.remove("hidden");

    bluetoothIcon.classList.remove(
        "hidden",
        "orange"
    );

    extraIcon.classList.add("hidden");


    /* =====================================================
       充电状态
    ====================================================== */

    if (chargeDisplay) {

        chargeDisplay.classList.add(
            "hidden"
        );

        chargeDisplay.classList.remove(
            "charging",
            "charged"
        );
    }


    if (chargeBatteryFill) {
        chargeBatteryFill.style.width =
            "0%";
    }


    if (chargeBatteryValue) {
        chargeBatteryValue.textContent =
            "";
    }


    /* =====================================================
       中央状态图标
    ====================================================== */

    qrCode.classList.add("hidden");

    loadingIcon.classList.add("hidden");

    successIcon.classList.add("hidden");

    failIcon.classList.add("hidden");


    /* 结束录音 */

    if (recordEndIcon) {
        recordEndIcon.classList.add(
            "hidden"
        );
    }


    /* LCD录音红点 */

    if (lcdRecordLight) {
        lcdRecordLight.classList.add(
            "hidden"
        );
    }


    markIcon.classList.add("hidden");

    updateIcon.classList.add("hidden");


    /* =====================================================
       波形
    ====================================================== */

    wave.classList.add("hidden");


    /* =====================================================
       进度
    ====================================================== */

    progressArea.classList.add(
        "hidden"
    );

    progressArea.classList.remove(
        "wifi-transfer-layout",
        "ble-transfer-layout"
    );

    progressFill.classList.remove(
        "cyan"
    );

    progressFill.style.width =
        "0%";

    progressText.textContent =
        "";


    /* =====================================================
       充电动画
    ====================================================== */

    batteryFill.classList.remove(
        "charging-animation"
    );


    /* =====================================================
       LCD文字
    ====================================================== */

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


    /* =====================================================
       实体LED
    ====================================================== */

    led.classList.remove(
        "recording"
    );


    /*
     * 默认恢复实体LED结构。
     * 只有方案2会隐藏整个灯孔。
     */

    if (ledArea) {
        ledArea.classList.remove(
            "led-area-hidden"
        );
    }


    /* =====================================================
       默认电量
    ====================================================== */

    setBattery(
        85,
        "green"
    );
}


/* =========================================================
   系统异常
   无图标
   第一行：异常原因
   第二行：错误码
========================================================= */

function showSystemError(title, code) {

    if (lcd) {
        lcd.classList.add(
            "system-error-layout"
        );
    }


    /* 隐藏顶部状态 */

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


    /* 确保所有图标隐藏 */

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


    if (recordEndIcon) {
        recordEndIcon.classList.add(
            "hidden"
        );
    }


    if (lcdRecordLight) {
        lcdRecordLight.classList.add(
            "hidden"
        );
    }


    /* 隐藏波形 */

    wave.classList.add(
        "hidden"
    );


    /* 隐藏进度 */

    progressArea.classList.add(
        "hidden"
    );


    /* 显示错误 */

    line1.textContent =
        title;

    line2.textContent =
        code;


    line1.classList.add(
        "text-red"
    );

    line2.classList.add(
        "text-red"
    );
}


/* =========================================================
   LCD完全熄屏
========================================================= */

function showNoDisplay() {

    if (lcd) {
        lcd.classList.remove(
            "recording-layout",
            "system-error-layout"
        );
    }


    /* 状态栏 */

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


    /* 充电 */

    if (chargeDisplay) {

        chargeDisplay.classList.add(
            "hidden"
        );

        chargeDisplay.classList.remove(
            "charging",
            "charged"
        );
    }


    /* 图标 */

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


    if (recordEndIcon) {
        recordEndIcon.classList.add(
            "hidden"
        );
    }


    if (lcdRecordLight) {
        lcdRecordLight.classList.add(
            "hidden"
        );
    }


    markIcon.classList.add(
        "hidden"
    );

    updateIcon.classList.add(
        "hidden"
    );


    /* 波形 */

    wave.classList.add(
        "hidden"
    );


    /* 进度 */

    progressArea.classList.add(
        "hidden"
    );


    /* 文字 */

    line1.textContent = "";

    line2.textContent = "";

    progressText.textContent = "";
}


/* =========================================================
   录音中
========================================================= */

function showRecording() {

    if (lcd) {
        lcd.classList.add(
            "recording-layout"
        );
    }


    /* 顶部状态栏 */

    statusBar.classList.remove(
        "hidden"
    );

    batteryStatus.classList.remove(
        "hidden"
    );

    bluetoothIcon.classList.remove(
        "hidden"
    );


    /* 动态波形 */

    wave.classList.remove(
        "hidden"
    );


    /* 录音状态 */

    line1.textContent =
        "";


    /* 时间 */

    line2.textContent =
        "00:23:18";


    /* 实体LED */

    led.classList.add(
        "recording"
    );
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


            stateTimer = setTimeout(
                () => setState("idle"),
                5000
            );

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



        /* =================================================
           录音状态
        ================================================= */


        case "idle":

            line1.textContent =
                "○";

            line2.textContent =
                "就绪";

            break;



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



        case "recordPause":

            line1.textContent =
                "暂停中";

            line2.textContent =
                "00:23:18";

            break;



        /* =================================================
           录音结束
        ================================================= */

        case "recordEnd":

            if (recordEndIcon) {
                recordEndIcon.classList.remove(
                    "hidden"
                );
            }

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

            failIcon.classList.remove(
                "hidden"
            );

            line1.textContent =
                "录音失败";

            line2.textContent =
                "";

            line1.classList.add(
                "text-red"
            );

            break;



        /* =================================================
           电量
        ================================================= */


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



        /* =================================================
           充电中

           左上角小电池 + 电量：隐藏
           中间大电池：保留
           中间 65%：保留
           “充电中”文字：隐藏
        ================================================= */

        case "charging":

            /*
             * 隐藏左上角小电池 + 百分比
             */

            batteryStatus.classList.add(
                "hidden"
            );


            /*
             * 保持原来的蓝牙逻辑
             */

            bluetoothIcon.classList.add(
                "hidden"
            );


            /*
             * 显示中间大电池
             */

            if (chargeDisplay) {

                chargeDisplay.classList.remove(
                    "hidden"
                );

                chargeDisplay.classList.add(
                    "charging"
                );
            }


            /*
             * 保留中间 65%
             */

            if (chargeBatteryValue) {

                chargeBatteryValue.textContent =
                    "65%";
            }


            /*
             * 保留 65% 电池填充
             */

            if (chargeBatteryFill) {

                chargeBatteryFill.style.width =
                    "65%";
            }


            /*
             * 不显示“充电中”等文字
             */

            line1.textContent =
                "";

            line2.textContent =
                "";

            break;



        /* =================================================
           充满电

           左上角小电池 + 电量：隐藏
           中间大电池：保留
           中间 100%：保留
           “已充满”文字：隐藏
        ================================================= */

        case "charged":

            /*
             * 隐藏左上角小电池 + 百分比
             */

            batteryStatus.classList.add(
                "hidden"
            );


            /*
             * 保持原来的蓝牙逻辑
             */

            bluetoothIcon.classList.add(
                "hidden"
            );


            /*
             * 显示中间大电池
             */

            if (chargeDisplay) {

                chargeDisplay.classList.remove(
                    "hidden"
                );

                chargeDisplay.classList.add(
                    "charged"
                );
            }


            /*
             * 保留中间 100%
             */

            if (chargeBatteryValue) {

                chargeBatteryValue.textContent =
                    "100%";
            }


            /*
             * 满电填充
             */

            if (chargeBatteryFill) {

                chargeBatteryFill.style.width =
                    "100%";
            }


            /*
             * 不显示“已充满”等文字
             */

            line1.textContent =
                "";

            line2.textContent =
                "";

            break;



        /* =================================================
           蓝牙
        ================================================= */


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


            stateTimer = setTimeout(
                () => setState("idle"),
                5000
            );

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


        case "bleTransfer":

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



        /* =================================================
           存储
        ================================================= */


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



        /* =================================================
           系统状态 / 异常
        ================================================= */


        /*
         * E101
         * 系统启动失败
         */

        case "systemStartFail":

            showSystemError(
                "系统启动失败",
                "E101"
            );

            break;



        /*
         * E201
         * 麦克风异常
         */

        case "micError":

            showSystemError(
                "麦克风异常",
                "E201"
            );

            break;



        /*
         * E301
         * 存储读取失败
         */

        case "storageReadFail":

            showSystemError(
                "存储读取失败",
                "E301"
            );

            break;



        /*
         * E602
         * 充电异常
         */

        case "chargeError":

            showSystemError(
                "「错误原因」",
                "「错误码」"
            );

            break;



        /* =================================================
           OTA
        ================================================= */


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


            failIcon.classList.remove(
                "hidden"
            );


            line1.textContent =
                "升级失败";

            line2.textContent =
                "";

            line1.classList.add(
                "text-red"
            );

            break;



        /* =================================================
           LED状态
        ================================================= */


        /* =================================================
           方案1 · LED录音灯

           LCD：黑屏
           实体LED：显示
           实体LED：亮红灯
        ================================================= */

        case "ledRecording":

            showNoDisplay();


            /*
             * 确保实体LED结构显示
             */

            if (ledArea) {

                ledArea.classList.remove(
                    "led-area-hidden"
                );
            }


            /*
             * 打开实体红灯
             */

            led.classList.add(
                "recording"
            );


            /*
             * LCD红点关闭
             */

            if (lcdRecordLight) {

                lcdRecordLight.classList.add(
                    "hidden"
                );
            }

            break;



        /* =================================================
           方案2 · LCD录音灯

           实体LED：整个隐藏
           LCD：黑屏
           LCD中央：小红点
        ================================================= */

        case "lcdRecordingLight":

            /*
             * LCD先完全清空
             */

            showNoDisplay();


            /*
             * 关闭实体LED
             */

            led.classList.remove(
                "recording"
            );


            /*
             * 隐藏整个实体LED区域
             *
             * 包括：
             * LED灯
             * LED灯孔
             * LED外圈
             */

            if (ledArea) {

                ledArea.classList.add(
                    "led-area-hidden"
                );
            }


            /*
             * LCD中央显示小红点
             */

            if (lcdRecordLight) {

                lcdRecordLight.classList.remove(
                    "hidden"
                );
            }

            break;

    }

}


/* =========================================================
   右侧状态按钮
========================================================= */

const stateButtons = document.querySelectorAll(
    "button[data-state]"
);


stateButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {


            /* 清除选中 */

            stateButtons.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            /* 当前按钮选中 */

            button.classList.add(
                "active"
            );


            /* 切换状态 */

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