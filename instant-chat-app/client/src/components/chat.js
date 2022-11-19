import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:4000');
export default function chat() {
    // var socket = io();
    function inputform() {
        var form = document.getElementById('form');
        var input = document.getElementById('input');
        var nick = document.querySelector(".nickBox");
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (input.value) {
                var message = input.value;
                //emitting message and nick to the server
                socket.emit("sentMessage", message);
                socket.emit("nick", nick.value);
                input.value = '';
                //dom manipulation for sent messages
                const div = document.createElement("div");
                div.classList.add("message");
                div.classList.add("sentMessage");
                div.innerHTML = message + "<br><span className = 'metaData'>" + nick.value + "</span>";
                document.querySelector(".messageContainer").appendChild(div);
                div.scrollIntoView();
                //time manipulation
                var d = new Date();
                if (d.getHours() > 12) {
                    if (d.getMinutes() < 10) {
                        div.innerHTML = div.innerHTML + "<div className='time'>" + (d.getHours() - 12) + ":0" + d.getMinutes() + " PM" + "</div>";
                    }
                    else {
                        div.innerHTML = div.innerHTML + "<div className='time'>" + (d.getHours() - 12) + ":" + d.getMinutes() + " PM" + "</div>";
                    }
                }
                else {
                    if (d.getMinutes() < 10) {
                        div.innerHTML = div.innerHTML + "<div className='time'>" + d.getHours() + ":0" + d.getMinutes() + " AM" + "</div>";
                    }
                    else {
                        div.innerHTML = div.innerHTML + "<div className='time'>" + d.getHours() + ":" + d.getMinutes() + " AM" + "</div>";
                    }
                }
            }
            document.querySelector(".nickBox").setAttribute("disabled", "disabled");
        });
        socket.on("botMessage", function (message) {
            console.log(message);
            //dom manipulation for bot messages
            const div = document.createElement("div");
            div.classList.add("message");
            div.classList.add("botMessage");
            div.innerHTML = message;
            document.querySelector(".messageContainer").appendChild(div);
            div.scrollIntoView();
        })

        //listening for incoming messages
        socket.on("receivedMessage", function (message) {
            // console.log(message);
            //dom manipulation for received messages
            const div = document.createElement("div");
            div.classList.add("message");
            div.classList.add("receivedMessage");
            div.innerHTML = message;
            document.querySelector(".messageContainer").appendChild(div);
            div.scrollIntoView();
        })

        // listening for incoming nicks
        socket.on("nick", function (message) {
            console.log(message);
            var length = document.querySelectorAll(".receivedMessage").length;
            var lastChild = document.querySelectorAll(".receivedMessage")[length - 1];
            lastChild.innerHTML = lastChild.innerHTML + "<br><span className = 'metaData'>" + message + "</span>";
            //time manipulation
            var d = new Date();
            if (d.getHours() > 12) {
                if (d.getMinutes() < 10) {
                    lastChild.innerHTML = lastChild.innerHTML + "<div className='time'>" + (d.getHours() - 12) + ":0" + d.getMinutes() + " PM" + "</div>";
                }
                else {
                    lastChild.innerHTML = lastChild.innerHTML + "<div className='time'>" + (d.getHours() - 12) + ":" + d.getMinutes() + " PM" + "</div>";
                }
            }
            else {
                if (d.getMinutes() < 10) {
                    lastChild.innerHTML = lastChild.innerHTML + "<div className='time'>" + d.getHours() + ":0" + d.getMinutes() + " AM" + "</div>";
                }
                else {
                    lastChild.innerHTML = lastChild.innerHTML + "<div className='time'>" + d.getHours() + ":" + d.getMinutes() + " AM" + "</div>";
                }
            }
        })


        socket.on("users", function (data) {
            var item = document.getElementsByClassName("activeUsers");
            var oldUsersValue = item[0].childNodes[0];
            let latestUsersValue = data.users;
            oldUsersValue.nodeValue = latestUsersValue;
        });

    }
    return (
        <form id="form" action="">
            <input className="nickBox" placeholder="Nickname" />
            <input id="input" autoComplete="off" className="messageBox" placeholder="Type a message..." />
{/* 
            <a className="sendButton linkButton emojiButton" data-bs-toggle="dropdown" aria-expanded="false">
                <span className="material-icons">
                    sentiment_satisfied_alt
                </span> */}
            {/* </a> */}
            <button className="sendButton" onClick = {inputform}>
                <span className="material-icons">
                    send
                </span>
            </button>
        </form>
    );
}