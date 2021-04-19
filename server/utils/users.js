class Users{
    constructor(){
        console.log('initiate constructor');
        this.userList = [];
    }

    adduser({id,room,name}){
        const newuser = {
            id,
            name,
            room
        }
        this.userList.push(newuser);
        console.log(this.userList);
    }

    deleteuser(id){

        let deleteUser;
        const newuserlist = this.userList.filter((user)=>{
            if(user.id === id){
                deleteUser = user;
            }
            return user.id !== id;
        });
        this.userList = newuserlist;
        return deleteUser;
    }

    finduser(id){

        const user = this.userList.filter((user)=>user.id===id);
        return user[0];
    }

    findRoomUser(room) {
        console.log("inside the find room users ");
        const users = this.userList.filter(user => user.room === room);
        // for (let user in this.userList) {
        //     if (user.room === room) {
        //         users.push(user.name);
        //     }
        // }
        console.log("Users in room", room, users);
        return users;
    }

}

module.exports = Users;