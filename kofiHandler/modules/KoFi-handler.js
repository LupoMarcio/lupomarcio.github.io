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
    regex = /Ehy\s(.+)!!\sGrazie\sper\sla\sdonazione\sdi\s(\d+.\d+€)!!/; //Ehy Someone!! Grazie per la donazione di 3.00€!!
    let match = message.match(regex);
    let donator; // User that donated money
    let amount; // String with the amount donated (currency included)
    let crudeNum;
    if (match) {
        donator = match[1];
        amount = match[2];
        crudeNum = parseFloat(amount.slice(0, -1));
        document.getElementById("username").innerHTML = donator;
        document.getElementById("amount").innerHTML = amount;
    }
    // USE DONATOR AND AMOUNT HERE
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