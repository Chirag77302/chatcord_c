            var socket = io();

            socket.on('connect',function(){
                var user = QueryStringToJSON();
                console.log(user);
                socket.emit('adduser',user);
            });


            function sendMessage(){
                console.log('send massaging route called');
                var msg = document.getElementById('text-message').value;
                if (msg.trim().length === 0) {
                    return;
                }
                const sendmsg = {
                    text:msg
                }
                console.log(sendmsg);
                socket.emit('sendmessage',sendmsg)
            }

            socket.on('receivedmessage',function(data){
                console.log('received message',data);
                const messagewrap = document.createElement('div');
                messagewrap.setAttribute('class','message');
                const html =   `
                <div class="">
                    <div class="from-details flex items-end">
                        <h4 class="from">${data.from}</h4>
                        <time datetime="${data.time}" class="time"><strong>${new Date(data.time).toLocaleString()}</strong></time>
                    </div>
                    <p class="res_msg">${data.text}</p>
                </div>`;

                messagewrap.innerHTML = html;
                const messagepanel = document.getElementById('message-panel');
                messagepanel.appendChild(messagewrap);
            })

            socket.on('updatelist',function(data){
                console.log('list is',data);
                var peoplelist = document.getElementById('people-list');
                peoplelist.innerHTML = "";

                for(var i in data){
                    const li = document.createElement('li');
                    li.innerHTML = `${data[i].name}`;
                    peoplelist.appendChild(li);
                }
            });

        
            function QueryStringToJSON(){
                var str = location.search.slice(1).split('&');
                var result = {};
                str.forEach(function(pair){
                    pair = pair.split('=');
                    result[pair[0]] = decodeURIComponent(pair[1]||'') ;
                })

                return JSON.parse(JSON.stringify(result));
            }