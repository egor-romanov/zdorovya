import { Telegraf } from 'telegraf';

function getRandomNumber(min = 0, max = 100000): number {
  return Math.round(Math.random() * (max - min) + min);
}

const bot = new Telegraf('');

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('I can do things'));

bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.command('pidor', (ctx) => {  
  ctx.getChatAdministrators().then(members => {
    const usernames = members.map(m => ' @' + m.user.username);
    
    const pidor = usernames[getRandomNumber(0, usernames.length - 1)];
    console.log(usernames, pidor);
        
    const resp = pidor + ' - ПИДОР!!! 😊😊😊'; 
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
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
