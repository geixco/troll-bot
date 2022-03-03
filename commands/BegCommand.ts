import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { wallet } from '../models/Wallet';

export const BegCommand = new TrollCommand(client, {
  name: 'beg',
  description: 'ask for money (L poor)',
  async run(message: Message) {
    try {
      let curWallet = await wallet.findOne({ id: message.author.id });

      // 3/4 chance of success
      let isSuccessful = Math.random() < 0.75;

      let people = [
        'a homeless person',
        'Elon Musk',
        'your mother',
        'your father',
        'Donald Trump',
        'i',
        'Low Tier God',
        'Doge',
        'Ben Shapiro',
        'Mr. Krabs',
        'aw hell naw my boy spunch bop',
        'Jonesy',
        'Eminem',
        'mocha',
        'some guy',
        'the impostor from among us',
        'ma man failes',
        'SkyBlueSeagull'
      ];

      let actions = {
        successful: [
          'gave you',
          'tipped you',
          'handed you',
          'brought you',
          'tossed you',
          'gifted you',
          'loaned you',
          'gave you a small loan of',
          'handed you a briefcase containing',
          'awarded you a whopping',
          'presented you with'
        ],
      unsuccessful: [
        'robbed you of',
        'ran away with',
        'pickpocketed you of your',
        'stole your',
        'bullied you into giving',
        'took your'
      ]}

      let amounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 22, 25, 30, 32, 36, 40, 45, 50, 56, 100, 125, 150, 200, 250, 500];

      let outcome = [
        people[Math.floor(Math.random() * people.length)], // person
        isSuccessful 
        ? actions.successful[Math.floor(Math.random() * actions.successful.length)] 
        : actions.unsuccessful[Math.floor(Math.random() * actions.unsuccessful.length)], // gave you/took your
        amounts[Math.floor(Math.random() * amounts.length)] // X coins
      ];

      let response = `**${outcome[0]}** ${outcome[1]} **${outcome[2]}** coins `;
      if (!isSuccessful) response += client.config.troll;

      if (isSuccessful) {
        if (curWallet)
          await wallet.findOneAndUpdate({ id: message.author.id }, { $set: { balance: curWallet.balance + (outcome[2] as number)} });
        else
          await (new wallet({ id: message.author.id, balance: outcome[2]})).save();
      } else {
        if (curWallet)
          await wallet.findOneAndUpdate({ id: message.author.id }, { $set: { balance: outcome[2] > curWallet.balance ? 0 : curWallet.balance - (outcome[2] as number)} });
        else
          response = `**${outcome[0]}** tried to rob you of your money, but you're broke as fuck! lmfao !!!`;
      }
      
      message.channel.send(response);
      
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
