var http = require('http');
var express = require("express");
var moment = require("moment");
const Users = require("./server/utils/users");
var path = require("path");
var app = express();

const PORT = process.env.PORT || 3000;
// console.log(process.env.PORT);
var server = app.listen(PORT,function(){
          console.log("server connected");
      });
var socketIO = require("socket.io");
var io = socketIO(server);
      
      
      const User = new Users();

      app.use(express.static(path.join(__dirname , 'views')));
      app.set('view engine','ejs');
      app.set('views',path.join(__dirname , 'views'));
      console.log("connected");

    
    app.get('/',(req,res)=>{
        console.log("koi to hai");
        console.log(req.originalUrl);
        if(req.originalUrl == "/"){
            res.render('enter');
        }else{
            res.render('index');
        }
    });

    
    io.on('connection' , (socket) =>{
        console.log("socket made" , socket.id);
        var id = socket.id;

        socket.on('adduser',function(data){
            if(User.finduser(socket.id)){
                User.deleteuser(socket.id);
            }

            const newuser = {
                id:socket.id,
                name:data.name,
                room:data.room
            }

            console.log('our new user is welcome for' , newuser);
            socket.join(data.room);

            User.adduser(newuser);
            const userinroom = User.findRoomUser(data.room);
            const welctext = {
                from: 'Admin',
                text: `${newuser.name} joined the room`,
                time: new Date()
            }

            socket.broadcast.to(data.room).emit('receivedmessage',welctext);
            io.to(data.room).emit('updatelist',userinroom);
        });

        socket.on('sendmessage',function(data){
            console.log('received message is',data);
            var user = User.finduser(socket.id);
            const messg = {
                from:user.name,
                text:data.text,
                time:new Date().getTime()
            }

            console.log("MESSAGE READY To SEND TO OTHERS ", messg);
            console.log("found user ", user);
            User.findRoomUser(user.room);
            io.to(user.room).emit('receivedmessage', messg);

        })

        socket.on('disconnect',(reason)=>{
            console.log('this is error');
            console.log(reason);
            var user = User.deleteuser(id);
            console.log(user);
            const userinrom = User.findRoomUser(user.room);
            const departuretext = {
                from:'Admin',
                text: `${user.name} left the room`,
                time: new Date().getTime()
            }
            console.log(departuretext);
            socket.broadcast.to(user.room).emit('receivedmessage',departuretext);
            io.to(user.room).emit('updatelist', userinrom);
        })


    });
