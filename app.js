
import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'
dotenv.config()
const {BOT_TOKEN} = process.env;
import CoinGecko from 'coingecko-api'


const bot = new Telegraf(BOT_TOKEN)


async function getCoinPrice(coinSymbol){
    const CoinGeckoClient = new CoinGecko();
    const data = await CoinGeckoClient.coins.list()
    const coinList = data['data']
    for (let coin of coinList){
        if ( coin.symbol === coinSymbol ){
            console.log(coin)
            const prices = await CoinGeckoClient.coins.fetchMarketChart(coin.id);
            const coinPrice = Number(prices.data.prices[0][1].toFixed(2))
            return coinPrice
            break
        }
    }
}

bot.on('text', async ctx => {
    const coinSymbol = ctx.message.text.toLowerCase()
    let coinPrice = await getCoinPrice(coinSymbol)
    if ( coinPrice != undefined){
        ctx.reply(`${ctx.message.text.toLowerCase()}: ${coinPrice}`)
        setTimeout(() => ctx.deleteMessage(ctx.message.message_id), 10000)
        setTimeout(() => ctx.deleteMessage(ctx.message.message_id+1), 10000)
    }
})

bot.launch()
