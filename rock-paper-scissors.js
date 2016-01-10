Weapons = new Mongo.Collection("weapons");
PlayerMoves = new Mongo.Collection("player_moves")
Outcomes = new Mongo.Collection("outcomes")
Router.route('/', function () {
  this.render('Home');
});
Router.route('/player_1', function () {
  this.render('weaponform');
});
Router.route('/player_2', function () {
  this.render('weaponform');
});
Router.route('/outcome', function(){
  this.render('outcome');
});

if (Meteor.isClient) {
  // This code only runs on the client
  Template.weaponform.events({
      "submit .new-move": function (event) {
        // Prevent default browser form submit
        event.preventDefault();
        // Get value from form element
        var text = event.target[0].value;
        var player = Router.current().route.path().slice(1)
            // Insert a task into the collection
        PlayerMoves.insert({
          text: text,
          player: player,
          createdAt: new Date() // current time
        });
        player_1_move = PlayerMoves.findOne({player: "player_1"});
        player_2_move = PlayerMoves.findOne({player: "player_2"});
        if (player_1_move && player_2_move){
          if (player_1_move.text == player_2_move.text){
              winner = "Draw";
          }
          if (player_1_move.text == "rock"){
            if(player_2_move.text == "scissors"){
              winner = "Player_1";
            }
            if(player_2_move.text == "paper"){
              winner = "Player_2";
            }
          }
          if (player_1_move.text == "scissors"){
            if(player_2_move.text == "rock"){
              winner = "Player_2";
            }
            if(player_2_move.text == "paper"){
              winner = "Player_1";
            }
          }
          if (player_1_move.text == "paper"){
            if (player_2_move.text == "scissors"){
              winner = "Player_2";
            }
            if(player_2_move.text == "rock"){
              winner = "Player_1";
            }
          }
          if(winner=="Player_1"){
            winning_hand = player_1_move.text;
            losing_hand = player_2_move.text;
          }
          else{
            winning_hand = player_2_move.text;
            losing_hand = player_1_move.text;
          }
          Outcomes.insert({
          player: winner,
          winning_hand: winning_hand,
          losing_hand: losing_hand,
          createdAt: new Date()
           });
          PlayerMoves.remove({ _id: player_1_move._id});
          PlayerMoves.remove({ _id: player_2_move._id});

        }
        Router.go('/outcome');

        // Clear form
        //event.target.text.value = "";
      }
    });
    Template.outcome.helpers({
      outcome: function () {
        return Outcomes.findOne({});
      },
      winning_rock: function(){
        outcome = Outcomes.findOne({});
        if(outcome){
          return outcome.winning_hand == "rock";
        }
      },
      winning_paper: function(){
        outcome = Outcomes.findOne({});
        if(outcome){
          return outcome.winning_hand == "paper";
        }
      },
      winning_scissors: function(){
        outcome = Outcomes.findOne({});
        if(outcome){
          return outcome.winning_hand == "scissors";
        }
      },
      losing_rock: function(){
        outcome = Outcomes.findOne({});
        if(outcome){
          return outcome.losing_hand == "rock";
        }
      },
      losing_paper: function(){
        outcome = Outcomes.findOne({});
        if(outcome){
          return outcome.losing_hand == "paper";
        }
      },
      losing_scissors: function(){
        outcome = Outcomes.findOne({});
        if(outcome){
          return outcome.losing_hand == "scissors";
        }
      }
    });
    Template.outcome.events({
      "click .play_again": function (event){
        Router.go('/');
        outcome = Outcomes.findOne({});
        if(outcome){
          Outcomes.remove({_id: outcome._id});
        };
      }
    });
    Template.home.events({
      "click .player_1_button": function (event){
        Router.go('/player_1');
      },
      "click .player_2_button": function (event){
        Router.go('/player_2');
      }
    });

}