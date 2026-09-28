const line1 =
    document.getElementById("line1");

const line2 =
    document.getElementById("line2");

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
   重置
===================================== */

function resetLCD() {

    clearTimeout(stateTimer);

    line1.textContent = "";
    line2.textContent = "";

    line1.className = "line-main";
    line2.className = "line-sub";

    line1.style.color = "";
    line2.style.color = "";

    statusBar.classList.remove(
        "hidden"
    );

    batteryStatus.classList.remove(
        "hidden"
    );

    batteryFill.classList.remove(
        "charging-animation"
    );

    bluetoothIcon.classList.remove(
        "hidden",
        "orange"
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

    progressText.textContent = "";

    progressFill.className =
        "progress-fill";

    progressFill.style.width =
        "65%";

    setBattery(
        85,
        "green"
    );

    led.classList.remove(
        "recording"
    );

}


/* =====================================
   电池
===================================== */

function setBattery(
    percent,
    type = "green"
) {

    batteryFill.style.width =
        `${percent}%`;

    batteryText.textContent =
        `${percent}%`;

    if (type === "red") {

        batteryStatus.style.color =
            "var(--red)";

    } else {

        batteryStatus.style.color =
            "var(--green)";

    }

}


/* =====================================
   LCD 无显示
===================================== */

function showNoDisplay() {

    statusBar.classList.add(
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

    line1.textContent = "";
    line2.textContent = "";

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

    line1.classList.add(
        "text-red"
    );

    led.classList.add(
        "recording"
    );

}


/* =====================================
   状态切换
===================================== */

function setState(state) {

    resetLCD();


    document
        .querySelectorAll(
            "button[data-state]"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.state === state
            );

        });


    switch (state) {


        /* =========================
           设备状态
        ========================= */

        case "firstBoot":

            statusBar.classList.add(
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



        /* =========================
           录音状态
        ========================= */

        case "idle":

            /*
             * 正常空闲 / 就绪状态
             * 顶部保留电池 + 蓝牙
             * 中间显示空心圆 + 就绪
             */

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

            /*
             * 暂停录音
             * 保留电池 + 蓝牙
             * 不显示波形
             * 不亮LED
             */

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



        /* =========================
           电量状态
        ========================= */

        case "batteryNormal":

            bluetoothIcon.classList.add(
                "hidden"
            );

            setBattery(
                85,
                "green"
            );

            break;


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



        /* =========================
           蓝牙状态
        ========================= */

        case "btWaiting":

            statusBar.classList.add(
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



        /* =========================
           数据传输状态
        ========================= */

        case "bleTransfer":

            line1.textContent =
                "正在传输";

            line1.classList.add(
                "text-blue"
            );

            progressArea.classList.remove(
                "hidden"
            );

            progressText.textContent =
                "65%";

            progressFill.style.width =
                "65%";

            break;


        case "bleTransferDone":

            showNoDisplay();

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
                "Wi-Fi高速传输";

            line1.classList.add(
                "text-cyan"
            );

            progressArea.classList.remove(
                "hidden"
            );

            progressText.textContent =
                "80%";

            progressFill.classList.add(
                "cyan"
            );

            progressFill.style.width =
                "80%";

            break;


        case "wifiTransferDone":

            showNoDisplay();

            break;



        /* =========================
           存储状态
        ========================= */

        case "storageNormal":

            showNoDisplay();

            break;


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



        /* =========================
           系统异常
        ========================= */

        case "systemError":

            line1.textContent =
                "设备异常";

            line1.classList.add(
                "text-red"
            );

            break;



        /* =========================
           OTA
        ========================= */

        case "welcome":

            showNoDisplay();

            break;


        case "updating":

            statusBar.classList.add(
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


        case "updateDone":

            showNoDisplay();

            break;


        case "updateFail":

            statusBar.classList.add(
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



        /* =========================
           LED
        ========================= */

        case "ledRecording":

            led.classList.add(
                "recording"
            );

            break;


        case "ledOff":

            break;


        case "ledPause":

            break;


        case "ledCharging":

            break;

    }

}


/* =====================================
   点击事件
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