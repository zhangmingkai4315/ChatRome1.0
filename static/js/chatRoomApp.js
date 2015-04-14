angular.module('chatRoomApp', []);

angular.module('chatRoomApp').factory('socket', function($rootScope){
		var socket=io.connect('');
		return {
		on:function(eventName,callBack){
			socket.on(eventName,function(){
				var args=arguments;
				$rootScope.$apply(function(){
					callBack.apply(socket,args);
				});
			});
		},
		emit:function(eventName,data,callBack){
			socket.emit(eventName,data,function(){
				var args=arguments;
				$rootScope.$apply(function(){
					if(callBack){
						callBack.apply(socket,args);
					}
				});
			});
		}
	};
});



angular.module('chatRoomApp').controller('RoomCtrl',function($scope,socket){
	$scope.messages=[];

	socket.emit('getAllMessages');
	socket.on('allMessages',function(messages){
		//alert(messages);
		$scope.messages=messages;
	});

	socket.on('messageAdded',function(message){

		$scope.messages.push(message);
	});
	
});


angular.module('chatRoomApp').controller('MessageCreatorCtrl',function($scope,socket){
	$scope.newMessage="";
	$scope.createMessage=function(){
		if($scope.newMessage=="")
			return; 
	    socket.emit('createMessage',$scope.newMessage);
	    $scope.newMessage="";
	}
   
	
});
angular.module('chatRoomApp').directive('autoScrollToBotton',function(){
	return{
		link:function(scope,element,attrs){
			scope.$watch(
				function(){
					return element.children().length;
				},
				function(){
					element.animate({
						scrollTop:element.prop('scrollHeight')
					},1000);
				}
		);
		}
	};
});


angular.module('chatRoomApp').directive('ctrlEnterBreakLine',function(){
	return function(scope,element,attrs){
		var ctrlDown=false;
		element.bind("keydown",function(evt){
			if(evt.which===17){
				alert("17");
				ctrlDown=true;
				setTimeout(function(){
					ctrlDown=false;
				},1000);
			}
			if(evt.which===13){

				if(ctrlDown){
					element.val(element.val()+'\n');
				}else{
					scope.$apply(function(){
						scope.$eval(attrs.ctrlEnterBreakLine);
					});
					evt.preventDefault();
				}
			}
		});
	};
});







