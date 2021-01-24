import axios from 'axios';
import { Telegraf } from 'telegraf';
import { imageClassification } from './ml';
import fs from 'fs';

function getRandomNumber(min = 0, max = 100000): number {
  return Math.round(Math.random() * (max - min) + min);
}

// Create your bot and tell it about your context type
const bot = new Telegraf('', {  });

bot.start((ctx) => {
  ctx.reply('Welcome');
  ctx.setMyCommands([
    { command: 'all', description: 'notify all', },
    { command: 'pidor', description: 'find traitor', },
  ]);
});
bot.help((ctx) => ctx.reply('I can do things'));

bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.hears(new RegExp('здоров|болел|болен|болеет|здорав|болею', 'gi'), (ctx) => ctx.reply('Дай Бог Здоровья!!!🥳😇💚'));
bot.command('pidor', (ctx) => {  
  ctx.getChatAdministrators().then(members => {
    const usernames = members.map(m => ' @' + m.user.username);
    
    const pidor = usernames[getRandomNumber(0, usernames.length - 1)];
    console.log(usernames, pidor);
        
    const resp = pidor + ' - ПИДОР!!!😊😊😊'; 
    ctx.reply(resp);
  });
});
bot.command('all', (ctx) => {  
  ctx.getChatAdministrators().then(members => {
    const usernames = members
      .filter(m => !m.user.is_bot)
      .map(m => ` [${m.user.first_name}](tg://user?id=${m.user.id})`);

    console.log(usernames);

    const resp = usernames.toString() + '\n' + ctx.message.text;
    ctx.reply(resp, { parse_mode: 'MarkdownV2', });
  });
});
bot.on('photo', async ctx => {
  const fileId = ctx.message.photo[1].file_id;

  ctx.telegram.getFileLink(fileId).then(url => {    
    axios({ url, responseType: 'stream', }).then(response => {
      return new Promise((resolve) => {
        response.data.pipe(fs.createWriteStream(`temp/${fileId}.jpg`)).on('finish', () => {
          imageClassification(fs.readFileSync(`temp/${fileId}.jpg`)).then(result => {
            const resp = 'Если вам интересно, я думаю это\n' + result.reduce<string>((acc, value) => {
              return acc + `${value.className} на ${value.probability}\n`;
            }, '');

            ctx.replyWithMarkdownV2('```\n' + resp + '```', { parse_mode: 'MarkdownV2', });
            resolve(resp);
          }); 
        }).on('error', e => {
          console.log(e);
        });
      }).then(() => fs.unlink(`temp/${fileId}.jpg`, () => { /* */ }));
    });
  });

});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
