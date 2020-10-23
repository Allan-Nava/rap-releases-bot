const Discord = require('discord.js')
const { realpathSync } = require('fs');
const { data } = require('jquery');
const { receiveMessageOnPort } = require('worker_threads');
const client = new Discord.Client()

const APPController = require('./spotify/spotyApp');

// Questo è un evento che permette di fare cose quando il bot si connette
// a un server

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)

    // Per modificare l'attività del bot
    client.user.setActivity("Spotify", {type: "LISTENING"})

    client.guilds.cache.forEach(g => {

        // stampa in console il nome del server a cui si è connessi
        console.log(g.name);

        // serve per stampare il nome, il tipo e l'id di ogni canale o 
        // categoria dentro al server

        g.channels.cache.forEach((channel) => {
            console.log(` - ${channel.name} ${channel.type} ${channel.id}`)
        
        // id canale generale text 768913303975886888
        })
    });


    // Così si invia un messaggio quando il bot si connette
    let generalChannel = client.channels.cache.get("768913303975886888")

    // Creo un allegato
    const attachment = new Discord.MessageAttachment("https://upload.wikimedia.org/wikipedia/it/4/4e/Ciao_PX.jpg")

    // Invio un allegato quando il bot si connette al server
    // generalChannel.send(attachment)

    // Invio un messaggio quando il bot si connette al server
    //generalChannel.send("Ciao zi")

    
})

// Questo invece è un evento che permette di rispondere a messaggi.
// Si attiva ogni volta che viene inviato un messaggio

client.on('message', (receivedMessage) => {

    // Per evitare che l'evento venga triggerato anche dai messaggi
    // del bot (creando un loop infinito), si aggiunge questa condizione
    if (receivedMessage.author == client.user) {
        return
    }

    // Creo una variabile in cui salvo il messaggio dell'utente e lo 
    // converto in lowercase
    let messaggioRicevuto = receivedMessage.content.toLocaleLowerCase();

    // Queste sono le possibili risposte all'utente
    switch(messaggioRicevuto) {
        case "token":
            const token = async () => {
                const data = await APPController.APPController.getToken()
                return data;
            };

            token().then(meta => {
                const risposta = async () => {
                    const data2 = await APPController.APPController.getReleases(meta);
                    return data2;
                };
                risposta().then(risp => {
                    //console.log(risp.albums.items[1].artists[1].name)
                    console.log(risp[1])
                    
                    let names = "";
                    //const attachment = new Discord.MessageAttachment(string)
                    //receivedMessage.channel.send("Facciamo runnare sta shit " + receivedMessage.author.toString() + " : " + risp.icons);
                    for(i=0; i < risp.length; i++) {
                        let release = "";
                        for(i=0; i < risp[i].artists.length; i++) {
                            
                            release += + "- " + risp[i].artists[i].name;
                        }   
                        names += "Release: " + release + "\n";
                    }
                    console.log(names)
                    
                    receivedMessage.channel.send(names);
                });
                
            });
            
            
            break;
        case "come va?":
            receivedMessage.channel.send("Bene, tu?");
        break;
        default:
        break;
    }
    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0];
    let arguments = splitCommand.slice(1);

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length == 0) {
        receivedMessage.channel.send("Non so cosa tu voglia chiedere. Prova con '!help [topic]'")
    } else {
        switch(arguments[0]) {
        case "prova":
            receivedMessage.channel.send("ciao");
        break;
        }
    }
}


// Fa loggare il bot, con il token che si trova sul sito

const token = "NzY4OTA0MzgxMDI1NjE1OTAy.X5HQAQ.6efIPTeqyJz_fbqM4XfkhVC2qDg";

client.login(token)