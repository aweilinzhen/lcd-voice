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

/* 系统异常统一图标 */
const systemErrorIcon = document.getElementById("systemErrorIcon");

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

/* 传输进度动画 */
let progressTimer = null;


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
   动态传输进度
========================================================= */

function animateProgress(target, label) {

    /* 停止旧动画 */

    if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
    }


    let current = 0;


    /* 从0开始 */

    progressFill.style.width =
        "0%";

    progressText.textContent =
        `${label}  0%`;


    /*
     * 38ms 增加1%
     *
     * 65% ≈ 2.5秒
     * 80% ≈ 3秒
     */

    progressTimer = setInterval(
        () => {

            current += 1;


            /* 防止超过目标值 */

            if (current > target) {
                current = target;
            }


            /* 更新进度条 */

            progressFill.style.width =
                current + "%";


            /* 更新百分比文字 */

            progressText.textContent =
                `${label}  ${current}%`;


            /* 到达目标 */

            if (current >= target) {

                clearInterval(
                    progressTimer
                );

                progressTimer = null;
            }

        },
        38
    );
}


/* =========================================================
   LCD 重置
========================================================= */

function resetLCD() {

    /* 停止状态计时 */

    if (stateTimer) {
        clearTimeout(stateTimer);
        stateTimer = null;
    }


    /* 停止传输动画 */

    if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
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

    extraIcon.classList.add(
        "hidden"
    );


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


    /* 系统异常统一图标 */

    if (systemErrorIcon) {

        systemErrorIcon.classList.add(
            "hidden"
        );
    }


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


    markIcon.classList.add(
        "hidden"
    );

    updateIcon.classList.add(
        "hidden"
    );


    /* =====================================================
       波形
    ====================================================== */

    wave.classList.add(
        "hidden"
    );


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

    line1.textContent =
        "";

    line2.textContent =
        "";


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
   左侧：统一圆形警告图标
   右侧第一行：错误原因
   右侧第二行：错误码
========================================================= */

function showSystemError(title, code) {

    if (lcd) {

        lcd.classList.add(
            "system-error-layout"
        );
    }


    /* =====================================================
       隐藏顶部状态
    ====================================================== */

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


    /* =====================================================
       隐藏其他图标
    ====================================================== */

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


    /* =====================================================
       显示统一系统异常图标
    ====================================================== */

    if (systemErrorIcon) {

        systemErrorIcon.classList.remove(
            "hidden"
        );
    }


    /* =====================================================
       隐藏波形
    ====================================================== */

    wave.classList.add(
        "hidden"
    );


    /* =====================================================
       隐藏进度
    ====================================================== */

    progressArea.classList.add(
        "hidden"
    );


    /* =====================================================
       错误原因
    ====================================================== */

    line1.textContent =
        title;


    /* =====================================================
       错误码
    ====================================================== */

    line2.textContent =
        code;


    /* =====================================================
       系统异常文字统一
    ====================================================== */

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


    /* =====================================================
       状态栏
    ====================================================== */

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


    /* =====================================================
       充电
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


    /* =====================================================
       图标
    ====================================================== */

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


    if (systemErrorIcon) {

        systemErrorIcon.classList.add(
            "hidden"
        );
    }


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


    /* =====================================================
       波形
    ====================================================== */

    wave.classList.add(
        "hidden"
    );


    /* =====================================================
       进度
    ====================================================== */

    progressArea.classList.add(
        "hidden"
    );


    /* =====================================================
       文字
    ====================================================== */

    line1.textContent =
        "";

    line2.textContent =
        "";

    progressText.textContent =
        "";
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



        /* =================================================
           E402 · 连接失败
        ================================================= */

        case "deviceConnectFail":

            showSystemError(
                "连接失败",
                "E402"
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



        /* =================================================
           E202 · 录音失败
        ================================================= */

        case "recordFail":

            showSystemError(
                "录音失败",
                "E202"
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
        ================================================= */

        case "charging":

            batteryStatus.classList.add(
                "hidden"
            );

            bluetoothIcon.classList.add(
                "hidden"
            );


            if (chargeDisplay) {

                chargeDisplay.classList.remove(
                    "hidden"
                );

                chargeDisplay.classList.add(
                    "charging"
                );
            }


            if (chargeBatteryValue) {

                chargeBatteryValue.textContent =
                    "65%";
            }


            if (chargeBatteryFill) {

                chargeBatteryFill.style.width =
                    "65%";
            }


            line1.textContent =
                "";

            line2.textContent =
                "";

            break;



        /* =================================================
           充满电
        ================================================= */

        case "charged":

            batteryStatus.classList.add(
                "hidden"
            );

            bluetoothIcon.classList.add(
                "hidden"
            );


            if (chargeDisplay) {

                chargeDisplay.classList.remove(
                    "hidden"
                );

                chargeDisplay.classList.add(
                    "charged"
                );
            }


            if (chargeBatteryValue) {

                chargeBatteryValue.textContent =
                    "100%";
            }


            if (chargeBatteryFill) {

                chargeBatteryFill.style.width =
                    "100%";
            }


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


        /* =================================================
           蓝牙传输
           0% → 65%
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


            animateProgress(
                65,
                "正在传输"
            );

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



        /* =================================================
           Wi-Fi传输
           0% → 80%
        ================================================= */

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


            progressFill.classList.add(
                "cyan"
            );


            animateProgress(
                80,
                "Wi-Fi高速传输"
            );

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


        case "systemStartFail":

            showSystemError(
                "系统启动失败",
                "E101"
            );

            break;



        case "micError":

            showSystemError(
                "麦克风异常",
                "E201"
            );

            break;



        case "storageReadFail":

            showSystemError(
                "存储读取失败",
                "E301"
            );

            break;



        /* =================================================
           规则说明
        ================================================= */

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



        /* =================================================
           E701 · 升级失败
        ================================================= */

        case "updateFail":

            showSystemError(
                "升级失败",
                "E701"
            );

            break;



        /* =================================================
           LED状态
        ================================================= */


        /* =================================================
           方案1 · LED录音灯
        ================================================= */

        case "ledRecording":

            showNoDisplay();


            if (ledArea) {

                ledArea.classList.remove(
                    "led-area-hidden"
                );
            }


            led.classList.add(
                "recording"
            );


            if (lcdRecordLight) {

                lcdRecordLight.classList.add(
                    "hidden"
                );
            }

            break;



        /* =================================================
           方案2 · LCD录音灯
        ================================================= */

        case "lcdRecordingLight":

            showNoDisplay();


            led.classList.remove(
                "recording"
            );


            if (ledArea) {

                ledArea.classList.add(
                    "led-area-hidden"
                );
            }


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