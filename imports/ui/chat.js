import './chat.html';

Template.chat.onCreated(function(){
	this.id = () => Router.current().params._id;

//	this.subscribe('chat', this.id());
});

Template.chat.helpers({
	messages: function(){
		return Games.findOne(Template.instance().id()).messages;
	},

	getClass: function(name){
		if(name === 'system') return 'system';
		if(name === Meteor.user().username) return 'me';

		return 'them';
	},

	isSystemMsg: function(name){
		if(name === 'system') return true;

		return false;
	}
});

Template.chat.events({
	'keypress input': function(evt, instance){
		if (evt.keyCode !== 13) return;

		Meteor.call('addMessage', evt.target.value, instance.id());

		evt.target.value = '';
	}
})