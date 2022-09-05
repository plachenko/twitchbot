import * as yt from 'youtube-search-without-api-key';
import Sentiment from 'sentiment';
import sqlite3 from 'sqlite3';
import OBSWebSocket from 'obs-websocket-js';

// const {default: OBSWebSocket} = require('obs-websocket-js');

const obs = new OBSWebSocket();
obs.connect('ws://0.0.0.0:4445');

const commandTrigger = "!";
const sentiment = new Sentiment();

export function start(){
    console.log('started');
}

export async function cmd(msg:string, user:string){
    // Remove whitespace from chat message
    const isCmd = msg.toString().startsWith(commandTrigger);

    const args: string[] = msg.slice(1).split(' ');
    const cmd = args.shift()?.toLowerCase().trim();

    // console.log(sentiment.analyze(msg).score);

    if(cmd == 'yt'){
        const videos = await yt.search(msg);

        console.log(args.unshift());
    }

}


export async function raidEvt(user: string){
    
}

export function end(){
    
}


export function hostEvt(user:string){
    
}