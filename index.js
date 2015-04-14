var express=require('express');
var app=express();
var path=require('path');
var http=require('http').Server(app);
var io=require('socket.io')(http);

var port=process.env.PORT||3000;

//添加静态文件支持
app.use(express.static(path.join(__dirname,"/static")));

//发送主页文件
app.use(function(req,res){
	res.sendFile(path.join(__dirname,'./static/index.html'));
});

//定义全部的聊天数据，如果想持久保持，可使用redis实现。
var messages=[]

io.on('connection',function(socket){
	console.log("A new client is online");
	socket.on("Online",function(msg){
		console.log("Online:"+msg);
	});

	socket.on("createMessage",function(msg){
		messages.push(msg);
		io.sockets.emit('messageAdded',msg);
	});


	socket.on("getAllMessages",function(){
		console.log("Client want get all messages");
		
		socket.emit('allMessages',messages);
	});
    

});

var server=http.listen(port,function(){
	console.log("ChatRoom is running on port:"+port);
});
