// Import Firebase - both from CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, push, onChildAdded, off, set, onValue, onDisconnect } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyCWDvh4HgUcCDgRRQYRzLuvzVWlphDbphc",
  authDomain: "nexuschat-a0b3e.firebaseapp.com",
  databaseURL: "https://nexuschat-a0b3e-default-rtdb.firebaseio.com",
  projectId: "nexuschat-a0b3e",
  storageBucket: "nexuschat-a0b3e.firebasestorage.app",
  messagingSenderId: "308235957831",
  appId: "1:308235957831:web:387f210e959f0d79452362"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const messageSound = new Audio('../assets/sfx/notif.wav')

const chatboxInput = document.getElementById('chatbox_input');
const roomOneButton = document.getElementById('room_one');
const roomTwoButton = document.getElementById('room_two');
const roomThreeButton = document.getElementById('room_three');
const imageButton = document.getElementById('image_button');
const settingsButton = document.getElementById('settings_button');

var current_Chatroom = 1;
var currentMessagesRef = null;
var nexus_username = localStorage.getItem('nexuschat_username') || 'User' + Math.floor(Math.random() * 1000);

chatboxInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const messageText = this.value;
    const messagesRef = ref(database, 'room' + current_Chatroom + '/messages');
    this.value = '';

    push(messagesRef, {
      username: nexus_username,
      text: messageText,
      timestamp: Date.now()
    });
    scrollToBottom();
  }
});

let typingTimeout;
chatboxInput.addEventListener('input', function() {
  const typingRef = ref(database, 'room' + current_Chatroom + '/typing/' + nexus_username)
  set(typingRef, true);

  onDisconnect(typingRef).remove();

  clearTimeout(typingTimeout);

  typingTimeout = setTimeout(function(){
    set(typingRef, null);
  }, 5000);
});

roomOneButton.addEventListener('click', function() {
  current_Chatroom = 1;
  document.getElementById('messages_container').innerHTML = '';
  listenToRoom(1);
});

roomTwoButton.addEventListener('click', function() {
  current_Chatroom = 2;
  document.getElementById('messages_container').innerHTML = '';
  listenToRoom(2);
});

roomThreeButton.addEventListener('click', function() {
  current_Chatroom = 3;
  document.getElementById('messages_container').innerHTML = '';
  listenToRoom(3);
});

imageButton.addEventListener('click', function() {
  document.getElementById('file-input').click();
});

settingsButton.addEventListener('click', function() {
  const newUsername = prompt('Enter your username:', nexus_username);
  if (newUsername && newUsername.trim() !== '') {
    nexus_username = newUsername.trim();
    localStorage.setItem('nexuschat_username', nexus_username);
    alert('Username changed to: ' + nexus_username);
  }
});

function scrollToBottom() {
  const container = document.getElementById('messages_container');
  container.scrollTop = container.scrollHeight;
}

function listenToRoom(roomNumber) {
  if (currentMessagesRef) {
    off(currentMessagesRef);
  }

  currentMessagesRef = ref(database, 'room' + roomNumber + '/messages');
  
  let isInitialLoad = true;
  
  onChildAdded(currentMessagesRef, (snapshot) => {
    const messageData = snapshot.val();
    const date = new Date(messageData.timestamp);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = '<strong>' + messageData.username + '</strong> <span style="color: rgba(255,255,255,0.5); font-size: 12px;">' + timeString + '</span><br>' + messageData.text;
    
    const container = document.getElementById('messages_container');
    container.appendChild(messageDiv);
    scrollToBottom();
    
    if (!isInitialLoad && messageData.username !== nexus_username) {
      messageSound.play().catch((err) => {
        console.warn('Sound playback blocked or failed:', err);
      });
    }
  });
  
  setTimeout(() => {
    isInitialLoad = false;
  }, 1000);
  
  listenForTyping(roomNumber);
}

function listenForTyping(roomNumber) {
  const typingRef = ref(database, 'room' + roomNumber + '/typing');
  
  onValue(typingRef, (snapshot) => {
    const typingUsers = snapshot.val();
    const typingDiv = document.getElementById('typing_indicator');
    
    if (typingUsers) {
      const users = Object.keys(typingUsers).filter(user => user !== nexus_username);
      if (users.length > 0) {
        typingDiv.textContent = users.join(', ') + ' is typing...';
      } else {
        typingDiv.textContent = '';
      }
    } else {
      typingDiv.textContent = '';
    }
  });
}

listenToRoom(current_Chatroom);
