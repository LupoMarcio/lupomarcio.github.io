// Get config from import params
const url = new URL(import.meta.url);
// const config = {
//   maxEmotes: Number(url.searchParams.get('maxEmotes')) || 20 // default to 20
// }

const sfx_list_file = await fetch("sfx_list.json");
const sfx_list = await sfx_list_file.json()
const sfx_keys = await Object.keys(sfx_list);
console.log(sfx_list);
console.log(sfx_keys);

// Load all the audio in an object called "sfxs"
// Structure of sfxs:
// {
//   "sfx_name1": {
//     "audio": Audio container,
//     "volume": audio volume
//     }
//   "sfx_name2": {
//     "audio": Audio container,
//     "volume": audio volume
//     }
//  ...
// }
let sfxs = {};
for (let i = 0; i < sfx_keys.length; i++) {
  sfxs[sfx_keys[i]] = new Audio(window.config.files_position + sfx_list[sfx_keys[i]].filename);
  sfxs[sfx_keys[i]].volume = sfx_list[sfx_keys[i]].volume;
}
console.log({sfxs});

let alert_counter = 0; // Counter of all the remaining alerts to play or ending
let alert_queue = []; // Array used as a FIFO buffer containing the donation messages

// TMI client configuration
const client = new tmi.Client({
  channels: [ 'lupomarcio']
});

client.connect();
// Info for the possilbe tags: https://dev.twitch.tv/docs/irc/tags/#privmsg-tags
await client.on('chat', (channel, tags, message, self) => {
  if (self) return;
  let sender = tags['user-id'];

  // console.log(message);
  // console.log(tags);
  
  // Function to test audios, triggered with: !testkofi sfx_name volume
  if (message.toLowerCase().substring(0,9) === '!testkofi' && tags['badges'] != null) {
    if ('broadcaster' in tags['badges'] && tags['badges']['broadcaster'] == 1) {
      console.log("recognized the testkofi command");
      let index_id = message.indexOf(' ');
      let index_volume = message.lastIndexOf(' ');
      let id = message.substring(index_id+1,index_volume);
      let volume = Number.parseFloat(message.substring(index_volume+1));
      console.log("ID that will be played:", id);
      console.log("Volume at which will be played:", volume);
      playSFX(id, volume);
    }
  }

  // Check for the Donation message
  // KofiStreamBot: 431199284
  // FesterBot ID: 173663394
  // LupoMarcio ID: 88803358
  // PieTheLemon: 68866589
  if (sender === '431199284' || sender === '173663394' || sender === '88803358' || sender === '68866589') {
    alert_queue.push(message); // Add the message to the queue
    console.log("Alert queue length", alert_queue.length);
    if (alert_counter === 0){ // Start the function only if it's the first element to go, otherwise it'll be played by the function itself
      showKoFiAlert();
    }

    // To play an audio, use: (example for lv1)
    // sfxs.lv1.play();
  }
});

// Function for testing, can be used from the Web console or through !testkofi (see up)
window.playSFX = function (identifier, volume) {
  // console.log(amen_users);
  console.log("Is available: ", sfx_keys.includes(identifier));
  if(sfx_keys.includes(identifier)) {
    sfxs[identifier].volume = volume;
    sfxs[identifier].play();
    console.log("Played");
  }
}

// Function that runs the alert animation
async function showKoFiAlert (){
  alert_counter += 1;
  let message = alert_queue.shift(); // Extract the message from the queue
  console.log("Function added is running.");
  // Regex to recognise donator and amount
  const regex = /Ehy\s(.+)!!\sGrazie\sper\sla\sdonazione\sdi\s(\d+.\d+€)!!/; //Ehy Someone!! Grazie per la donazione di 3.00€!!
  const match = message.match(regex);
  let pausettaSecs = 0;
  if (match) {
    let donator = match[1]; // User that donated money
    let amount = match[2]; // String with the amount donated (currency included)
    let crudeNum = parseFloat(amount.slice(0, -1));
    // Animation activation
    document.getElementById("username").innerHTML = donator;
    document.getElementById("amount").innerHTML = amount;

    // To work well, the else if structure should have decreasing value of crudeNum
    // (the float version of amount, which is a string)
    if(crudeNum >= 90.00){ //100
      pausettaSecs = sfxs.b10000.duration;
      sfxs.b10000.play();
    }
    else if(crudeNum >= 65.00){ //75
      pausettaSecs = sfxs.b7500.duration;
      sfxs.b7500.play();
    }
    else if(crudeNum >= 50.00){
      pausettaSecs = sfxs.b5000.duration;
      sfxs.b5000.play();
    }
    else if(crudeNum >= 40.00){
      pausettaSecs = sfxs.b4000.duration;
      sfxs.b4000.play();
    }
    else if(crudeNum >= 35.00){
      pausettaSecs = sfxs.b3500.duration;
      sfxs.b3500.play();
    }
    else if(crudeNum >= 30.00){
      pausettaSecs = sfxs.b3000.duration;
      sfxs.b3000.play();
    }
    else if(crudeNum >= 25.00){
      pausettaSecs = sfxs.b2500.duration;
      sfxs.b2500.play();
    }
    else if(crudeNum >= 20.00){
      pausettaSecs = sfxs.b2000.duration;
      sfxs.b2000.play();
    }
    else if(crudeNum >= 15.00){
      pausettaSecs = sfxs.b1500.duration;
      sfxs.b1500.play();
    }
    else if(crudeNum >= 10.00){
      pausettaSecs = sfxs.b1000.duration;
      sfxs.b1000.play();
    }
    else if(crudeNum >= 7.00){
      pausettaSecs = sfxs.b700.duration;
      sfxs.b700.play();
    }
    else if(crudeNum >= 5.00){
      pausettaSecs = sfxs.b500.duration;
      sfxs.b500.play();
    }
    else if(crudeNum >= 4.00){
      pausettaSecs = sfxs.b400.duration;
      sfxs.b400.play();
    }
    else if(crudeNum >= 3.00){
      pausettaSecs = sfxs.b300.duration;
      sfxs.b300.play();
    }
    else if(crudeNum >= 2.00){
      pausettaSecs = sfxs.b200.duration;
      sfxs.b200.play();
    }
    else {
      pausettaSecs = sfxs.b100.duration;
      sfxs.b100.play();
    }
    console.log("sfx duration:", pausettaSecs);

    if (pausettaSecs < window.config.min_pause) // Check if the pause is at least a minimum value
      pausettaSecs = window.config.min_pause; // min_pause is defined in the index.html
    let tl = gsap.timeline({repeat:0, repeatDelay:0, yoyo:false});
    tl.to("#alert_widget-container", {duration: 0, opacity:"0"})
      .to("#alert_widget-container", {duration: 1, className:"animate__animated animate__bounceIn", delay:0})
      .to("#alert_widget-container", {duration: pausettaSecs, opacity:"1", delay: 0}, "-=1")
      .to("#alert_widget-container", {duration: 1, className:"animate__animated animate__bounceOut", delay:0})
      .to("#alert_widget-container", {duration: 0, opacity:"0", className:"", delay:0})
    // Pause to wait for the animation to end;
    // the await term means that the program will pause until the timer is done
    // This way, the main part of the script can keep running, looking for other
    // messages of the donation bot
    console.log('Pause starting');
    let sleepTime = pausettaSecs * 1000;
    await sleep(sleepTime).then(() => {console.log("Pause done!");});
    alert_counter -= 1;
    console.log("Alert counter", alert_counter);
    // If there is other messages, swoKoFiAlert is called recursively until alert_queue is empty 
    if (alert_queue.length > 0){ 
      console.log("Called funzioneTest again");
      showKoFiAlert();
    }
  }
}

// Function to pause the execution of a task
const sleep = ms => new Promise(r => setTimeout(r, ms));
