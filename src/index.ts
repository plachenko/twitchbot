import * as tmi from 'tmi.js';
import * as bot from './bot.js';
import * as dotenv from 'dotenv';
dotenv.config();

const opts: any = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

const botGreet = false;

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('connected', onConnectedHandler);
client.on('message', onMessageHandler);
client.on('raided', onRaidHandler);
client.on('hosted', onHostHandler);

// Connect to Twitch
client.connect();

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr:string, port:number) {
  console.log(`* Connected to ${addr}:${port}`);
  bot.start();
  if(!botGreet) return;

  client.say(opts.channels[0], 'HeyGuys');
}

// Called every time a message comes in
async function onMessageHandler (channel:string, user:any, msg:string, self:any) {

  // if it's a single emote or character return.
  if(msg.length == 1 || self) return;

  // Set up user privs
  user.admin = (user.username == opts.channels[0].slice(1));
  
  const output:any = await bot.cmd(msg, user);

  if(output){
    client.say(channel, output);
  }
}
  
  // Called every time a raid comes in
async function onRaidHandler(chan:string, user:string, viewers:number){
  const output:any = await bot.raidEvt(user);

  if(output){
    client.say(chan, output);
  }
}
  
// Called every time a host comes in
async function onHostHandler(chan:string, user:string, viewers:number, autohost:boolean){
  console.log(chan, user, viewers, autohost)
  if(autohost) return;

  const output:any = await bot.hostEvt(user);

  if(output){
    client.say(chan, output);
  }
}

/*-- Catch the exit event --*/
process.stdin.resume();

function exitHandler(options:any, exitCode:any) {
  /*
  if (options.cleanup) console.log('clean');
  if (exitCode || exitCode === 0) console.log(exitCode);
  */
  if (options.exit){
    bot.end();
    process.exit();
  }
}

process.on('uncaughtException', (err)=>{
  console.log(err);
});

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
/* -- */
