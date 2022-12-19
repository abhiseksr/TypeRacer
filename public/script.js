let username;
while (!username)
    username = prompt("Enter your name");
let socket;
function run() {
    socket = io("http://localhost:3000", {
        query: {
            user: username
        }
    });

    socket.on("update", data => {
        // console.log("hello");
        let meter = document.createElement("progress");
        let metercontainer = document.createElement("div");
        let meterlabel = document.createElement("label");
        let span = document.createElement("span");
        let info = document.createElement("div");
        // let progresscontainer = document.createElement("div");
        let list = document.getElementById("meters");
        // let set = data.ids;
        // Array.from(list.children).forEach(k=>{
        //     if (!set.includes(k.getAttribute("id"))) k.classList.add("burr");
        // })
        // console.log(data.timm);
        // console.log(set);
        if (!gameOver)
            document.querySelector(".overlay").innerHTML = data.countdown;
        meter.setAttribute("min", 0);
        // progresscontainer.setAttribute("class","progress-container");
        meter.setAttribute("max", 100);
        meter.setAttribute("value", data.val);
        meter.setAttribute("id", data.id);
        info.setAttribute("class", "info");
        let query = document.getElementById(data.id);
        // console.log(timer,correctWords);
        span.innerHTML = `<b>${parseInt(correctWords * 60 / (timer + 0.1))}</b> WPM`;
        span.setAttribute("class", "span");
        // console.log(data.id,query);
        meterlabel.setAttribute("for", data.id);
        meterlabel.setAttribute("id", "meterlabel");
        meterlabel.innerHTML = `${data.user}`;
        metercontainer.setAttribute("id", "metercontainer");
        info.append(meterlabel);
        info.append(span);
        // progresscontainer.append(meter);
        metercontainer.append(info);
        // metercontainer.append(progresscontainer);
        metercontainer.append(meter);
        if (!query) list.append(metercontainer);
        else query.setAttribute("id", data.id);
        document.getElementById(data.id).setAttribute("value", data.val);
        Array.from(list.children).forEach(k => {
            let labelelement = k.querySelector("label");
            let spanelement = k.querySelector("span");
            if (labelelement.getAttribute("for") === data.id) {
                if (!labelelement.classList.contains("personal"))
                    labelelement.classList.add("personal"),
                        spanelement.classList.add("personal");
                spanelement.innerHTML = `<b>${parseInt(data.correctWords * 60 / (data.timer + 0.1))}</b> WPM`;
            }
            else if (labelelement.classList.contains("personal")) labelelement.classList.remove("personal"), spanelement.classList.remove("personal");
        })
    })

    socket.on("delete", data => {
        let query = document.getElementById(data.id);
        query.remove();
    })

    socket.on("start", () => {
        // console.log("Game started");
        document.querySelector(".overlay").classList.add("temp");
        pause = 0;
    })

    socket.on("result", list => {
        // console.log("result client side");
        // console.log(list);
        if (gameOver) {
            pause = 1;
            // const overlay = document.querySelector(".overlay");               
            document.querySelector(".overlay").classList.remove("temp");
            document.querySelector(".overlay").classList.add("fontsize");
            document.querySelector(".overlay").innerHTML = getResultHTML(list);
            // console.log(overlay.innerHTML);
        }
    })

    setInterval(() => {
        // console.log("goo");
        socket.emit("update", { value, timer, faltuKeyStrokes, keyStrokes, wrongWords, correctWords });
    }, 1);
    // id="sprKZzajf_CiGsYXAAAJ"


}
run();

function setGameOver() {
    // console.log("game over client");
    clearInterval(intervalId);
    textArea.style.display = "none";
    typeArea.disabled = true;
    gameOver = 1;
    socket.emit("over", { timer, faltuKeyStrokes, keyStrokes, wrongWords, correctWords });
}

function getResultHTML(list) {
    let toptable = `<table class="result-table"><thead><tr>
    <th>
    <p><strong>Position</strong></p>
    </th>
    <th>
    <p><strong>Username</strong></p>
    </th>
    <th>
    <p><strong>WPM</strong></p>
    </th>
    <th>
    <p><strong>Keystrokes</strong></p>
    </th>
    <th>
    <p><strong>Accuracy</strong></p>
    </th>
    <th>
    <p><strong>Correct words</strong></p>
    </th>
    <th>
    <p><strong>Wrong words</strong></p>
    </th>
    <th>
    <p><strong>Times</strong></p>
    </th>
</tr></thead><tbody>`;

    let bodytable = "";

    list.forEach((user, idx) => {
        bodytable += `<tr>
    <td>#${idx + 1}</td>
    <td><strong>${user.user}</strong></td>
    <td class="statswrongright">${parseInt(user.correctWords * 60 / (user.timer + 0.1))}<div>(words per minute)</div></td>
    <td>
    <span class="kst">( <span class="ksr">${user.keyStrokes - user.faltuKeyStrokes}</span> | <span
                            class="ksw">${user.faltuKeyStrokes}</span> ) <span class="kstt">${user.keyStrokes}</span></span>
    </td>
    <td>${parseInt((user.keyStrokes - user.faltuKeyStrokes) * 100 / user.keyStrokes)}%</td>
    <td>${user.correctWords}</td>
    <td>${user.wrongWords}</td>
    <td>${new Date(user.timer * 1000).toISOString().substring(14, 19)}</td>
</tr>`;
    })

    let bottomtable = `</tbody></table>`;
    return toptable + bodytable + bottomtable;
}