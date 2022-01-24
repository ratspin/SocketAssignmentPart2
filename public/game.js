const socket = io.connect("http://localhost:4000");

let firstPlayer=false;
let SecondPlayer=false;
let roomID;


$(".createBtn").click(function(){
    firstPlayer=true;
    SecondPlayer=true;
    const playerName=$("input[name=p1name").val();
    socket.emit('createGame',{name:playerName});
})


socket.on("newGame",(data)=>{
    $(".newRoom").hide();
    $(".joinRoom").hide();
    $("#message").html("Waiting for player 2, room ID is "+data.roomID).show();
    roomID=data.roomID;
})


$(".joinBtn").click(function(){
    const playerName=$("input[name=p2name").val();
    roomID=$("input[name=roomID").val();  
    socket.emit('joinGame',{
        name:playerName,
        roomID:roomID
    });
})


socket.on("player2Joined",(data)=>{
    transition(data)  ;
  })
  

socket.on("player1Joined",(data)=>{
    transition(data)  ;
})


$(".controls button").click(function (){
    const choice=$(this).html().trim();
    const choiceEvent=firstPlayer?"choice1":"choice2";
    socket.emit(choiceEvent,{
        choice: choice,
        roomID:roomID
    });
})


socket.on("result",(data)=>{
    if(data.winner=="draw"){
        $("#message").html("It's a draw!");
        $("#message2").html(" ");
    }else{
        updateWinner(firstPlayer==data.winner?"player1":"player2");
        updateLooser(SecondPlayer==data.winner?"player2":"player1");
    }
})

const updateWinner=(player)=>{
    const winnerName=$("."+player+" .name").html().trim();
    $("#message").html("Player "+winnerName+" WON!");
}

const updateLooser=(player)=>{
    const Loosername=$("."+player+" .name").html().trim();
    $("#message2").html("Player "+Loosername+" Loose!");
}


const transition=(data)=>{
    $(".newRoom").hide();
    $(".joinRoom").hide();
    $(".leaderboard").show();
    $(".controls").show();
    $(".player1 .name").html(data.p1name);
    $(".player2 .name").html(data.p2name);
    $("#message").html(data.p1name+" is here!").show();
}