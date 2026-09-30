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

const markIcon = document.getElementById("markIcon");
const updateIcon = document.getElementById("updateIcon");

const wave = document.getElementById("wave");

const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");

const progressArea = document.getElementById("progressArea");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const lcd = document.querySelector(".lcd");


/* =========================================================
   定时器
========================================================= */

let stateTimer = null;

/* 传输 / OTA 进度动画 */
let progressTimer = null;

/* 录音流动波形 */
let recordingWaveTimer = null;


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
   动态进度
========================================================= */

function animateProgress(target, label) {

    if (progressTimer) {

        clearInterval(progressTimer);

        progressTimer = null;
    }

    let current = 0;

    progressFill.style.width = "0%";

    progressText.textContent =
        `${label}  0%`;

    progressTimer = setInterval(
        () => {

            current += 1;

            if (current > target) {

                current = target;
            }

            progressFill.style.width =
                current + "%";

            progressText.textContent =
                `${label}  ${current}%`;

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
   停止录音流动波形
========================================================= */

function stopRecordingWave() {

    if (recordingWaveTimer) {

        clearInterval(
            recordingWaveTimer
        );

        recordingWaveTimer = null;
    }

}


/* =========================================================
   录音流动波形
========================================================= */

let recordingWaveBars = [];
let recordingWaveAmplitudes = [];


/* 标记2直接呈现录音波形并强调中央柱，不切换右侧按钮状态。 */
function triggerMarker2() {
    console.log("triggerMarker2 running");

    /* 将录音中的LCD显示效果直接提供给标记2按钮。 */
    if (!lcd.classList.contains("recording-layout")) {
        resetLCD();
        showRecording();
    } else {
        lcd.classList.remove("recording-offscreen");
        wave.classList.remove("hidden");
    }

    const allBars = wave
        ? Array.from(wave.querySelectorAll(".record-dot"))
        : [];
    console.log("wave count", allBars.length);

    const bars = allBars.slice(0, 19);

    if (!bars.length) {
        return;
    }

    bars.forEach(bar => bar.classList.remove("marker-active"));

    const markerIndex = Math.floor(bars.length / 2);
    const markerBar = bars[markerIndex];

    void markerBar.offsetWidth;
    markerBar.classList.add("marker-active");
}


/* =========================================================
   绘制录音波形
========================================================= */

function renderRecordingWave() {

    recordingWaveBars.forEach(
        (bar, index) => {

            /* 只显示19根 */

            if (index >= 19) {

                bar.style.display =
                    "none";

                bar.classList.remove("marker-active");

                return;
            }

            bar.style.display =
                "block";

            /* =================================================
               原录音波形高度
            ================================================= */

            const position =
                1 - index / 18;

            const gain =
                0.35 +
                position * 0.95;

            const amplitude =
                recordingWaveAmplitudes[
                    index
                ] || 0.1;

            let height =
                3 +
                amplitude *
                gain *
                28;

            height = Math.min(
                31,
                height
            );

            height = Math.max(
                3,
                height
            );

            bar.style.height =
                height + "px";
        }
    );
}


/* =========================================================
   开始录音流动波形
========================================================= */

function startRecordingWave() {

    stopRecordingWave();

    recordingWaveBars =
        Array.from(
            document.querySelectorAll(
                ".dot-wave .record-dot"
            )
        );

    /* 普通录音波形初始化时清除上次标记2留下的颜色。 */
    recordingWaveBars.forEach(bar => {
        bar.classList.remove("marker-active");
    });

    if (
        !recordingWaveBars.length
    ) {

        return;
    }


    /* =====================================================
       原始录音波形
    ====================================================== */

    recordingWaveAmplitudes = [

        0.82,
        0.68,
        0.76,
        0.58,
        0.72,

        0.52,
        0.62,
        0.46,
        0.56,
        0.42,

        0.48,
        0.36,
        0.40,
        0.30,
        0.28,

        0.22,
        0.18,
        0.14,
        0.10

    ];

    /* 第一次绘制 */

    renderRecordingWave();


    /* =====================================================
       波形持续流动
    ====================================================== */

    recordingWaveTimer =
        setInterval(
            () => {


                /* 波形向左移动 */

                recordingWaveAmplitudes.shift();


                /* =================================================
                   生成新的声音
                ================================================= */

                let newAmplitude;

                const random =
                    Math.random();


                if (
                    random > 0.88
                ) {

                    newAmplitude =
                        0.55 +
                        Math.random() *
                        0.25;

                } else if (
                    random > 0.62
                ) {

                    newAmplitude =
                        0.32 +
                        Math.random() *
                        0.22;

                } else if (
                    random > 0.28
                ) {

                    newAmplitude =
                        0.16 +
                        Math.random() *
                        0.18;

                } else {

                    newAmplitude =
                        0.06 +
                        Math.random() *
                        0.10;
                }


                /* 新声音加入右侧 */

                recordingWaveAmplitudes.push(
                    newAmplitude
                );


                /* 重新绘制 */

                renderRecordingWave();

            },

            300
        );
}


/* =========================================================
   LCD 重置
========================================================= */

function resetLCD() {

    /* =====================================================
       停止状态计时
    ====================================================== */

    if (stateTimer) {

        clearTimeout(stateTimer);

        stateTimer = null;
    }


    /* =====================================================
       停止进度动画
    ====================================================== */

    if (progressTimer) {

        clearInterval(progressTimer);

        progressTimer = null;
    }


    /* =====================================================
       停止录音流动波形
    ====================================================== */

    stopRecordingWave();


    /* =====================================================
       清除特殊布局
    ====================================================== */

    if (lcd) {

        lcd.classList.remove(
            "recording-layout",
            "recording-offscreen",
            "connect-page",
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


    if (chargeBatteryFill) {

        chargeBatteryFill.style.width =
            "0%";
    }


    if (chargeBatteryValue) {

        chargeBatteryValue.textContent =
            "";
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
       电池动画
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
       默认电量
    ====================================================== */

    setBattery(
        85,
        "green"
    );
}


/* =========================================================
   系统异常
========================================================= */

function showSystemError(
    title,
    code
) {

    if (lcd) {

        lcd.classList.add(
            "system-error-layout"
        );
    }


    /* 隐藏顶部 */

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


    /* 隐藏其他图标 */

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


    /* 显示系统异常圆形图标 */

    if (systemErrorIcon) {

        systemErrorIcon.classList.remove(
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


    /* 错误原因 */

    line1.textContent =
        title;


    /* 错误码 */

    line2.textContent =
        code;


    /* 文字 */

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
   LCD 熄屏
========================================================= */

function showNoDisplay() {

    /* 停止波形 */

    stopRecordingWave();


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

    line1.textContent =
        "";

    line2.textContent =
        "";

    progressText.textContent =
        "";
}


/* LCD录音波形画面 */

function showRecording() {

    if (lcd) {

        lcd.classList.add(
            "recording-layout"
        );
    }


    /* 顶部状态 */

    statusBar.classList.remove(
        "hidden"
    );

    batteryStatus.classList.remove(
        "hidden"
    );

    bluetoothIcon.classList.remove(
        "hidden"
    );


    /* 显示波形 */

    wave.classList.remove(
        "hidden"
    );


    /* 启动实时流动波形 */

    startRecordingWave();


    /* 时间 */

    line1.textContent =
        "";

    line2.textContent =
        "00:23:18";


}


/* 首次开机与待连接共用同一连接引导页面。 */
function renderConnectPage({ mode }) {
    lcd.classList.add("connect-page");
    qrCode.dataset.mode = mode;

    statusBar.classList.add("hidden");
    batteryStatus.classList.add("hidden");
    bluetoothIcon.classList.add("hidden");
    extraIcon.classList.add("hidden");

    qrCode.classList.remove("hidden");
    line1.textContent = "";
    line2.textContent = "";
}


/* =========================================================
   状态控制
========================================================= */

function setState(state) {

    /* 录音熄屏只遮蔽LCD内容，保留录音波形更新。 */
    if (state === "recordingOffScreen") {
        if (!lcd.classList.contains("recording-layout") || !recordingWaveTimer) {
            resetLCD();
            showRecording();
        }

        lcd.classList.add("recording-offscreen");
        return;
    }

    /* 从录音熄屏恢复录音显示时，保留正在滚动的波形。 */
    if (
        state === "recording" &&
        lcd.classList.contains("recording-offscreen")
    ) {
        lcd.classList.remove("recording-offscreen");
        return;
    }

    resetLCD();


    switch (state) {


        /* =================================================
           设备状态
        ================================================= */


        case "firstBoot":
            renderConnectPage({ mode: "firstBoot" });
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
                setTimeout(
                    () =>
                        setState(
                            "idle"
                        ),
                    5000
                );

            break;



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


        case "recording":

            showRecording();
            break;



        case "recordPause":

            line1.textContent =
                "暂停中";

            line2.textContent =
                "00:23:18";

            break;



        case "recordEnd":

            if (recordEndIcon) {

                recordEndIcon.classList.remove(
                    "hidden"
                );
            }

            line1.textContent =
                "结束录音";

            break;



        /* =================================================
           标记 · 原方案1
           保持不变
        ================================================= */

        case "mark":

            markIcon.classList.remove(
                "hidden"
            );

            line1.textContent =
                "已标记";

            break;



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
           充电
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
            renderConnectPage({ mode: "waiting" });
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
                setTimeout(
                    () =>
                        setState(
                            "idle"
                        ),
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


            stateTimer =
                setTimeout(
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
           系统异常
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



        case "chargeError":

            showSystemError(
                "「错误原因」",
                "「错误码」"
            );

            break;



        /* =================================================
           OTA升级
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


            animateProgress(
                65,
                "升级中"
            );

            break;



        case "updateFail":

            showSystemError(
                "升级失败",
                "E701"
            );

            break;



    }
}


/* =========================================================
   右侧状态按钮
========================================================= */

const stateButtons =
    document.querySelectorAll(
        "button[data-state]"
    );


stateButtons.forEach(
    button => {

        if (button.dataset.state === "mark2") {
            return;
        }

        button.addEventListener(
            "click",
            () => {

                /* 清除选中 */

                stateButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                /* 当前按钮 */

                button.classList.add(
                    "active"
                );


                /* 切换状态 */

                setState(
                    button.dataset.state
                );

            }
        );
    }
);

const marker2Button = document.querySelector(
    'button[data-state="mark2"]'
);

if (marker2Button) {
    marker2Button.addEventListener("click", () => {
        console.log("marker2 clicked");

        stateButtons.forEach(button => {
            button.classList.remove("active");
        });
        marker2Button.classList.add("active");

        triggerMarker2();
    });
} else {
    console.error('button[data-state="mark2"] not found');
}


/* =========================================================
   默认状态
========================================================= */

setState("idle");
