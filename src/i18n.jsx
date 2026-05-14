import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'chongya:lang';
const DEFAULT_LANG = 'en';

const dict = {
  en: {
    nav: {
      meaning: 'Meaning',
      tokenomics: 'Tokenomics',
      howToBuy: 'How to Buy',
      about: 'About',
      squad: 'The Squad',
      buyCta: 'Buy CHONGYA',
      home: 'Chongya home',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      langSwitch: 'Switch language',
    },
    hero: {
      eyebrow: 'Powered by BNB Chain',
      tagline: 'CHARGE, DUCK.',
      lead:
        'A community-owned duck on BNB Chain. Fair launch, zero tax, no team bag. One mission: ',
      leadEm: 'to the moon.',
      ctaBuy: 'Buy on PancakeSwap',
      ctaHowTo: 'How to buy',
      statChain: 'Chain',
      statSupply: 'Supply',
      statTax: 'Tax',
      badge: 'Chart going parabolic',
    },
    meaning: {
      eyebrow: 'What does 冲鸭 mean',
      title: 'The cutest way to say ',
      titleGold: '“Let’s go.”',
      sub1: '冲鸭 (Chōng Yā)',
      sub2: ' = Go for it. Let’s go. You got this. Charge!',
      sub3: 'It’s the high-energy, maximum-cuteness Chinese cousin of ',
      sub3Gold: 'LFG',
      sub3End: '.',
      chongMeaning: 'to charge forward · rush · push hard',
      yaMeaning: 'duck · the cutest animal in Chinese memes',
      resultMeaning: '“Charge, duck!”',
      note: [
        'Chinese netizens replaced the normal exclamation ',
        { zh: '“呀” (ya)' },
        ' with ',
        { zh: '“鸭” (yā)' },
        ' because ducks are adorable in Chinese internet culture. The result — an expression that feels both ',
        { hl: 'powerful' },
        ' and ',
        { hl: 'ridiculously cute' },
        ' at the same time.',
      ],
    },
    tokenomics: {
      eyebrow: 'Tokenomics',
      title: 'Boring numbers. ',
      titleGold: 'Loud duck.',
      sub:
        'No hidden allocations. No vesting cliffs. Just a fair launch and a community that holds.',
      cards: [
        { label: 'Total Supply', value: '1,000,000,000', desc: 'A clean billion. No mint function, no surprises.' },
        { label: 'Buy / Sell Tax', value: '0% / 0%', desc: 'Trade freely. The duck takes no cut.' },
        { label: 'LP Burned', value: '100%', desc: 'Liquidity burned forever. No rug switch.' },
        { label: 'Community', value: '100%', desc: 'No team wallet, no VC bag. Owned by holders.' },
      ],
      contractLabel: 'Contract Address (BSC)',
      copy: 'Copy',
      copied: 'Copied',
      addToWallet: 'Add to Wallet',
      copyAria: 'Copy contract address',
      addAria: 'Add CHONGYA to wallet',
    },
    howToBuy: {
      eyebrow: 'How to Buy',
      title: 'Four steps to join ',
      titleGold: 'the flight.',
      sub: 'Even your grandma can do this. Probably faster than you.',
      steps: [
        {
          title: 'Get a Wallet',
          body: 'Install Binance Web3 Wallet (or any BNB Chain compatible wallet) on your device.',
        },
        {
          title: 'Fund with BNB',
          body: 'Buy BNB on your favorite exchange and send it to your wallet on the BSC network.',
        },
        {
          title: 'Connect PancakeSwap',
          body: 'Head to PancakeSwap, connect your wallet, and paste the CHONGYA contract address.',
        },
        {
          title: 'Swap & Hold',
          body: 'Set your slippage, confirm the swap, and welcome to the flock. Now hold tight.',
        },
      ],
    },
    about: {
      eyebrow: 'About · 关于冲鸭',
      title: 'More than a duck. ',
      titleGold: 'A whole universe.',
      sub:
        'CHONGYA isn’t one duck — it’s a growing IP on BNB Chain: a cast of characters, a community, a culture. No suits, no slides, no whitepaper full of buzzwords — just a whole flock that refuses to back down. While others promise the moon, this universe is already packing for the trip.',
      points: [
        'Fair launch, no presale, no team allocation, no VC kickbacks.',
        'Liquidity burned forever. Contract renounced from day one.',
        '100% community-owned. Memes, art, and culture by the holders.',
        'Built on BNB Chain for fast, low-fee transactions.',
      ],
    },
    squad: {
      eyebrow: 'The Chongya Squad',
      title: 'One flock. ',
      titleGold: 'One family.',
      sub: 'Meet the crew — or take six questions and find your duck. No right answers. Just ducks.',
      tapHint: 'Tap any duck to meet them',
      takeQuizCta: 'Which duck are YOU? →',
      backToGalleryCta: 'Back to the flock',
      mysteryChip: 'Coming soon',
      mysteryAria: 'Hidden duck — coming soon',
      mysteryThumbName: 'Hidden',
      members: [
        {
          name: 'Golden Boss',
          tagline: 'The OG. Leads the charge to the moon.',
          color: '#F0B90B',
          stats: [
            { label: 'Charge', value: '99' },
            { label: 'Vibe', value: '∞' },
            { label: 'Bags', value: 'MAX' },
          ],
        },
        {
          name: 'Snow Builder',
          tagline: 'Ships code at 3am. Sleeps never.',
          color: '#F5F5F7',
          stats: [
            { label: 'Commits', value: '999' },
            { label: 'Sleep', value: '0' },
            { label: 'Caffeine', value: '∞' },
          ],
        },
        {
          name: 'Rosy Degen',
          tagline: 'Buys the dip. Buys the rip. Just buys.',
          color: '#FF9EC4',
          stats: [
            { label: 'FOMO', value: '∞' },
            { label: 'Patience', value: '1' },
            { label: 'Slippage', value: 'MAX' },
          ],
        },
        {
          name: 'Violet Whale',
          tagline: 'Moves the chart when it gets bored.',
          color: '#B189FF',
          stats: [
            { label: 'Bags', value: '∞' },
            { label: 'TVL', value: '99%' },
            { label: 'Stealth', value: '0' },
          ],
        },
        {
          name: 'Sky Chad',
          tagline: 'Calls the next pump before it happens.',
          color: '#7CB7FF',
          stats: [
            { label: 'Alpha', value: '99' },
            { label: 'Calls', value: '999' },
            { label: 'Humble', value: '0' },
          ],
        },
        {
          name: 'Mint Memer',
          tagline: 'Viral templates and pure chaos.',
          color: '#7CE4A2',
          stats: [
            { label: 'Memes', value: '999' },
            { label: 'Chaos', value: '∞' },
            { label: 'Logic', value: '0' },
          ],
        },
        {
          name: 'Onyx Sniper',
          tagline: 'Quiet in chat. Loudest on the chart.',
          color: '#2A2A33',
          stats: [
            { label: 'Stealth', value: '∞' },
            { label: 'Hit Rate', value: '99' },
            { label: 'Mercy', value: '0' },
          ],
        },
        {
          name: '???',
          tagline: 'Hatching soon. Stay tuned, duck.',
          color: '#3a3a45',
          mystery: true,
        },
      ],
    },
    quiz: {
      eyebrow: 'YBTI · Duck Type Indicator',
      title: 'Eight questions. ',
      titleGold: 'One YBTI code.',
      sub: 'Sixteen duck personalities. Pick fast — first instinct wins. No right answers, only roasts.',
      progress: 'Q{n} / {total}',
      hint: 'Press 1–4 to pick · R to restart',
      resultLabel: 'Your YBTI:',
      axesTitle: 'Personality breakdown',
      commentaryLabel: 'The roast',
      shareCta: 'Share my YBTI',
      retakeCta: 'Retake',
      shareTemplate: '🚀🦆 My YBTI: {code} · {title}\n\n“{commentary}”\n\n{axesLine}\n\nWhat\'s YOUR YBTI?\n$CHONGYA #冲鸭',
      axes: [
        { left: { letter: 'C', label: 'Chase' },  right: { letter: 'H', label: 'Hold' } },
        { left: { letter: 'A', label: 'Ape' },    right: { letter: 'R', label: 'Research' } },
        { left: { letter: 'L', label: 'Loud' },   right: { letter: 'Q', label: 'Quiet' } },
        { left: { letter: 'D', label: 'Degen' },  right: { letter: 'B', label: 'Boss' } },
      ],
      questions: [
        {
          axis: 0,
          q: 'Your bag is +200% this week. You:',
          options: [
            { text: 'Sell some. Take profits.', side: 'right' },
            { text: 'Add more. Up only.', side: 'left' },
            { text: 'Hold all of it. Never selling.', side: 'right' },
            { text: 'Send the gains into a new launch.', side: 'left' },
          ],
        },
        {
          axis: 0,
          q: 'A coin you missed is now +50x. You:',
          options: [
            { text: 'Buy at the top. FOMO in.', side: 'left' },
            { text: 'Wait for the dip — never buy.', side: 'right' },
            { text: 'Find the next one. Chase the next pump.', side: 'left' },
            { text: 'Whatever. My bags will get there.', side: 'right' },
          ],
        },
        {
          axis: 1,
          q: 'A new launch in 10 minutes. You:',
          options: [
            { text: 'Bridge funds, slippage 50%, send it.', side: 'left' },
            { text: 'Read the contract first.', side: 'right' },
            { text: 'Already in. Quick Twitter check.', side: 'left' },
            { text: 'Read five threads then decide.', side: 'right' },
          ],
        },
        {
          axis: 1,
          q: 'Your friend asks "should I buy X?". You:',
          options: [
            { text: 'Yes. Just buy.', side: 'left' },
            { text: 'Send them the contract + audit + docs.', side: 'right' },
            { text: 'Send my wallet. Let them copy-trade.', side: 'left' },
            { text: 'Tell them to wait and do research.', side: 'right' },
          ],
        },
        {
          axis: 2,
          q: 'Your tweet from yesterday was:',
          options: [
            { text: 'Five memes and one "wagmi".', side: 'left' },
            { text: 'Nothing. I don\'t tweet.', side: 'right' },
            { text: 'A four-tweet thread.', side: 'left' },
            { text: 'One "gm" reply.', side: 'right' },
          ],
        },
        {
          axis: 2,
          q: 'In group chat, you:',
          options: [
            { text: 'Drop alpha first, no questions.', side: 'left' },
            { text: 'Lurk for weeks.', side: 'right' },
            { text: 'React with emoji only.', side: 'right' },
            { text: 'Spam pepes and "lfg".', side: 'left' },
          ],
        },
        {
          axis: 3,
          q: 'Your portfolio — BTC + ETH allocation:',
          options: [
            { text: '80%+. Rest is yield.', side: 'right' },
            { text: '5%. Rest is shitcoins.', side: 'left' },
            { text: '50/50 blue chips and small caps.', side: 'right' },
            { text: 'Zero. ETH is dead.', side: 'left' },
          ],
        },
        {
          axis: 3,
          q: 'Your dream return on the next trade:',
          options: [
            { text: '100x or zero.', side: 'left' },
            { text: '20% APY, compounded.', side: 'right' },
            { text: '1000x is realistic.', side: 'left' },
            { text: '2x in a year is great.', side: 'right' },
          ],
        },
      ],
      types: {
        CALD: { title: 'Reckless Aper',           duck: 2, commentary: 'Loudest in chat, first to ape every launch, slippage 99% is fine. Logic doesn\'t exist. Lifetime win rate: coin flip.' },
        CALB: { title: 'Loud Blue-Chip Bro',      duck: 4, commentary: 'Only buys top-10 — but always all-in one coin. Then evangelizes BNB philosophy for three days straight.' },
        CAQD: { title: 'Midnight Sniper Degen',   duck: 6, commentary: '3am all-ins on 0day tokens, never speaks. Exits at 5x and vanishes until the next launch.' },
        CAQB: { title: 'Silent Operator',         duck: 3, commentary: 'Quietly buys blue-chip breakouts. Portfolio never public. By the time anyone notices, you\'ve already taken profit ten times.' },
        CRLD: { title: 'Academic Degen',          duck: 1, commentary: 'Reads ten threads, all-ins a shitcoin, then writes a four-tweet thread explaining why this one\'s different. Repeats next week.' },
        CRLB: { title: 'Loud Researcher',         duck: 4, commentary: 'Reads GitHub, audits, LinkedIn. Then loudly calls BTC ETF in the group chat. KOL trajectory confirmed.' },
        CRQD: { title: 'Quiet Sniper',            duck: 6, commentary: 'Reads the contract 5 minutes before launch, apes silently, exits at 5x. The perfect invisible winner.' },
        CRQB: { title: 'Data-Driven Ghost',       duck: 1, commentary: 'Data-driven, blue-chip focused, 30% APY quietly compounded. Family only finds out when you accidentally leave the app open.' },
        HALD: { title: 'Diamond-Hand Memer',      duck: 5, commentary: 'Your wallet holds a –98% shitcoin from three years ago. You still post "the cycle is coming back" every week.' },
        HALB: { title: 'Just-Don\'t-Sell Boss',   duck: 0, commentary: 'Bought BTC at 40k, won\'t sell at 120k. Daily post: "Just don\'t sell." The most reliable psychological holder.' },
        HAQD: { title: 'Frozen Bag Bro',          duck: 2, commentary: 'Aped a shitcoin three years ago. Forgot the wallet password. Holding by accident — passive diamond hands win.' },
        HAQB: { title: 'OG Whale',                duck: 3, commentary: 'Bought BTC in 2013, never tweets, 8-figure portfolio. Hardly anyone in CT has ever met you.' },
        HRLD: { title: 'Memelord HODLer',         duck: 5, commentary: 'Long-term holder by day, meme spammer by night. Follower count grows through sheer pettiness.' },
        HRLB: { title: 'Influencer Boss',         duck: 4, commentary: 'Monthly theses, perma-BTC bull, 500k YouTube subs. Next cycle you\'ll be top of CT.' },
        HRQD: { title: 'Stealth Quant',           duck: 6, commentary: 'Writes own bots, runs yield, zero portfolio disclosure. Anon legend, can\'t even be DYOR\'d.' },
        HRQB: { title: 'Cold Storage Godfather',  duck: 1, commentary: 'Cold wallet + multisig + physical safe. Nobody knows your BTC count. Not even the state can find your cash flow.' },
      },
    },
    community: {
      eyebrow: 'Join the flock',
      bannerParts: ['WAGMI', '一起冲', 'TO THE MOON'],
      sub: 'One duck. One chart. One community building the loudest meme on BNB Chain.',
      buyCta: 'Buy CHONGYA',
      tgCta: 'Telegram',
      xCta: 'Follow on X',
      discordCta: 'Discord',
    },
    bgm: {
      playAria: 'Play background music',
      muteAria: 'Mute background music',
    },
    footer: {
      copyright: 'All ducks reserved.',
      disclaimer:
        'CHONGYA is a meme token with no intrinsic value or expectation of financial return. Cryptocurrencies are highly volatile and risky. Do your own research and never invest more than you can afford to lose. This website does not constitute financial advice.',
    },
  },

  zh: {
    nav: {
      meaning: '梗意',
      tokenomics: '代币经济',
      howToBuy: '购买方式',
      about: '关于',
      squad: '鸭子家族',
      buyCta: '购买 CHONGYA',
      home: '冲鸭首页',
      openMenu: '打开菜单',
      closeMenu: '关闭菜单',
      langSwitch: '切换语言',
    },
    hero: {
      eyebrow: 'BNB Chain 强力驱动',
      tagline: '冲！就完事了。',
      lead:
        'BNB Chain 上由社区掌控的小鸭子。公平发射、零税、无团队预留。只有一个使命：',
      leadEm: '冲上月球。',
      ctaBuy: '去 PancakeSwap 买',
      ctaHowTo: '怎么买',
      statChain: '链',
      statSupply: '总量',
      statTax: '税',
      badge: 'K线已起飞',
    },
    meaning: {
      eyebrow: '冲鸭 是什么意思',
      title: '说 ',
      titleGold: '「LFG」',
      titleAfter: ' 最可爱的方式',
      sub1: '冲鸭 (Chōng Yā)',
      sub2: ' = 冲啊！加油！上！你可以的！',
      sub3: '它是 ',
      sub3Gold: 'LFG',
      sub3End: ' 在中文里满血、满萌的小表弟。',
      chongMeaning: '向前冲 · 奔跑 · 用力推',
      yaMeaning: '鸭子 · 中文 meme 里最萌的动物',
      resultMeaning: '「冲啊，鸭！」',
      note: [
        '中文网友把感叹词 ',
        { zh: '「呀」(ya)' },
        ' 换成了 ',
        { zh: '「鸭」(yā)' },
        '，因为鸭子在中文互联网文化里实在太可爱。结果就诞生了一种既 ',
        { hl: '有力量' },
        ' 又 ',
        { hl: '萌到爆' },
        ' 的表达。',
      ],
    },
    tokenomics: {
      eyebrow: '代币经济',
      title: '数字很无聊，',
      titleGold: '鸭子很大声。',
      sub: '没有隐藏分配，没有解锁悬崖。只有公平发射和长期持有的社区。',
      cards: [
        { label: '总发行量', value: '10 亿', desc: '一整十亿。没有铸币函数，没有惊喜。' },
        { label: '买卖税', value: '0% / 0%', desc: '随便交易。鸭子不抽成。' },
        { label: 'LP 销毁', value: '100%', desc: '流动性永久销毁。没有 rug 后门。' },
        { label: '社区占比', value: '100%', desc: '没有团队钱包，没有 VC 仓位。完全属于持有者。' },
      ],
      contractLabel: '合约地址（BSC）',
      copy: '复制',
      copied: '已复制',
      addToWallet: '添加到钱包',
      copyAria: '复制合约地址',
      addAria: '把 CHONGYA 添加到钱包',
    },
    howToBuy: {
      eyebrow: '怎么买',
      title: '四步加入',
      titleGold: '这趟飞行。',
      sub: '你奶奶都能学会。大概率比你还快。',
      steps: [
        {
          title: '准备钱包',
          body: '在手机上装 Binance Web3 钱包（或任意支持 BNB Chain 的钱包）。',
        },
        {
          title: '充值 BNB',
          body: '在你常用的交易所买 BNB，转到自己钱包的 BSC 网络地址上。',
        },
        {
          title: '连接 PancakeSwap',
          body: '打开 PancakeSwap，连接钱包，粘贴 CHONGYA 合约地址。',
        },
        {
          title: '兑换并持有',
          body: '设置滑点，确认交易，欢迎加入鸭群。剩下的就是稳稳拿住。',
        },
      ],
    },
    about: {
      eyebrow: '关于 · About',
      title: '不止一只鸭，',
      titleGold: '是一整个鸭宇宙。',
      sub:
        '冲鸭不是一只鸭，而是诞生在 BNB Chain 上的一整个 IP —— 一群角色，一个社区，一种文化。没有西装精英，没有路演 PPT，没有充满黑话的白皮书 —— 只有一整群死不退缩的鸭子。别人都在承诺登月，这个宇宙已经在打包行李了。',
      points: [
        '公平发射，无预售，无团队份额，无 VC 输送。',
        '流动性永久销毁，合约第一天就放弃管理权。',
        '100% 社区拥有，meme、艺术、文化都由持有者创造。',
        '建在 BNB Chain 上，交易快、费用低。',
      ],
    },
    squad: {
      eyebrow: '冲鸭家族',
      title: '一群鸭，',
      titleGold: '一个家。',
      sub: '先认识全员，或者用六道题找出你是哪只。没有标准答案，只有鸭子。',
      tapHint: '点击任意鸭子认识它',
      takeQuizCta: '测一下我是哪只 →',
      backToGalleryCta: '回到家族',
      mysteryChip: '即将登场',
      mysteryAria: '隐藏款 — 即将登场',
      mysteryThumbName: '隐藏款',
      members: [
        {
          name: '金色老大',
          tagline: '元老。带头冲向月球。',
          color: '#F0B90B',
          stats: [
            { label: '冲劲', value: '99' },
            { label: '气场', value: '∞' },
            { label: '仓位', value: 'MAX' },
          ],
        },
        {
          name: '雪白码农',
          tagline: '凌晨三点提交代码。从不睡觉。',
          color: '#F5F5F7',
          stats: [
            { label: '提交', value: '999' },
            { label: '睡眠', value: '0' },
            { label: '咖啡', value: '∞' },
          ],
        },
        {
          name: '玫红 Degen',
          tagline: '抄底也买，追高也买，反正就是买。',
          color: '#FF9EC4',
          stats: [
            { label: 'FOMO', value: '∞' },
            { label: '耐心', value: '1' },
            { label: '滑点', value: 'MAX' },
          ],
        },
        {
          name: '紫色巨鲸',
          tagline: '无聊的时候顺手砸/拉一下盘。',
          color: '#B189FF',
          stats: [
            { label: '仓位', value: '∞' },
            { label: 'TVL', value: '99%' },
            { label: '低调', value: '0' },
          ],
        },
        {
          name: '天蓝大佬',
          tagline: '在拉盘发生之前就喊单。',
          color: '#7CB7FF',
          stats: [
            { label: 'Alpha', value: '99' },
            { label: '喊单', value: '999' },
            { label: '谦虚', value: '0' },
          ],
        },
        {
          name: '薄荷段子手',
          tagline: '负责生产爆款梗图和混乱。',
          color: '#7CE4A2',
          stats: [
            { label: '梗图', value: '999' },
            { label: '混乱', value: '∞' },
            { label: '逻辑', value: '0' },
          ],
        },
        {
          name: '玄武狙击手',
          tagline: '群里沉默。线上最响。',
          color: '#2A2A33',
          stats: [
            { label: '隐身', value: '∞' },
            { label: '命中', value: '99' },
            { label: '心慈', value: '0' },
          ],
        },
        {
          name: '???',
          tagline: '正在孵化中。敬请期待，鸭。',
          color: '#3a3a45',
          mystery: true,
        },
      ],
    },
    quiz: {
      eyebrow: 'YBTI · 鸭格鉴定',
      title: '八道题，',
      titleGold: '一组 YBTI 代码。',
      sub: '16 种鸭格。凭第一直觉选 —— 不假思索的那个就是真的你。没有标准答案，只有锐评。',
      progress: '第 {n} / {total} 题',
      hint: '按 1–4 选项 · 按 R 重测',
      resultLabel: '你的 YBTI 是：',
      axesTitle: '人格构成',
      commentaryLabel: '锐评',
      shareCta: '分享我的 YBTI',
      retakeCta: '重新鉴定',
      shareTemplate: '🚀🦆 我的 YBTI：{code} · {title}\n\n「{commentary}」\n\n{axesLine}\n\n你的 YBTI 是？\n$CHONGYA #冲鸭',
      axes: [
        { left: { letter: 'C', label: '冲' },   right: { letter: 'H', label: '持' } },
        { left: { letter: 'A', label: '梭' },   right: { letter: 'R', label: '研' } },
        { left: { letter: 'L', label: '响' },   right: { letter: 'Q', label: '蛰' } },
        { left: { letter: 'D', label: '狗' },   right: { letter: 'B', label: '主' } },
      ],
      questions: [
        {
          axis: 0,
          q: '你的仓位这周 +200%。你：',
          options: [
            { text: '卖一点，先落袋。', side: 'right' },
            { text: '加仓。Up only。', side: 'left' },
            { text: '一动不动，永远不卖。', side: 'right' },
            { text: '把利润梭进新土狗。', side: 'left' },
          ],
        },
        {
          axis: 0,
          q: '你错过的一个币现在 +50x。你：',
          options: [
            { text: '顶部追上，FOMO 进场。', side: 'left' },
            { text: '等回调 —— 最后没买。', side: 'right' },
            { text: '找下一个，继续追。', side: 'left' },
            { text: '无所谓。我自己仓位也会到。', side: 'right' },
          ],
        },
        {
          axis: 1,
          q: '新币 10 分钟后开盘。你：',
          options: [
            { text: '桥过去，滑点 50%，all-in。', side: 'left' },
            { text: '先把合约读一遍。', side: 'right' },
            { text: '已经在里面了，再扫一眼 X。', side: 'left' },
            { text: '读 5 篇 thread 再决定。', side: 'right' },
          ],
        },
        {
          axis: 1,
          q: '朋友问「现在能买 X 吗」。你：',
          options: [
            { text: '能！直接冲。', side: 'left' },
            { text: '发合约 + audit 给他。', side: 'right' },
            { text: '发自己钱包，让他抄。', side: 'left' },
            { text: '让他先看资料，别急。', side: 'right' },
          ],
        },
        {
          axis: 2,
          q: '你昨天发的推：',
          options: [
            { text: '5 张梗图 + 一句 wagmi。', side: 'left' },
            { text: '什么都没发。我不发推。', side: 'right' },
            { text: '一条四推 thread。', side: 'left' },
            { text: '回了一句「gm」。', side: 'right' },
          ],
        },
        {
          axis: 2,
          q: '群聊里你：',
          options: [
            { text: '第一个甩 alpha，不问问题。', side: 'left' },
            { text: '潜水好几周。', side: 'right' },
            { text: '只用 emoji 回应。', side: 'right' },
            { text: '刷 pepe 和 lfg。', side: 'left' },
          ],
        },
        {
          axis: 3,
          q: '你的仓位 BTC + ETH 占比：',
          options: [
            { text: '80%+，剩下跑 yield。', side: 'right' },
            { text: '5%，剩下都是土狗。', side: 'left' },
            { text: '一半蓝筹一半小币。', side: 'right' },
            { text: '0。ETH 已经死了。', side: 'left' },
          ],
        },
        {
          axis: 3,
          q: '下一笔交易你的理想收益：',
          options: [
            { text: '100x 或者归零。', side: 'left' },
            { text: '20% 年化，复利。', side: 'right' },
            { text: '1000x 才合理。', side: 'left' },
            { text: '一年 2x 就很好。', side: 'right' },
          ],
        },
      ],
      types: {
        CALD: { title: '土狗梭哈王',     duck: 2, commentary: '群里最响、新土狗最早冲、滑点 99% 也照打。逻辑？不存在。这辈子是赢家还是 rekt 各占一半。' },
        CALB: { title: '头铁蓝筹党',     duck: 4, commentary: '永远只买 top10，但买的方式是 all-in 单一币种。买完群里宣讲 BNB 哲学三天三夜。' },
        CAQD: { title: '深夜土狗杀手',   duck: 6, commentary: '凌晨 3 点默默梭哈 0day token，从不发言。盈利 5x 直接下车，下次大家又看不到你了。' },
        CAQB: { title: '闷声大蓝筹',     duck: 3, commentary: '蓝筹突破默默买，账户从不公开。等到大家想起来你的时候，你已经获利离场十次了。' },
        CRLD: { title: '学院派 Degen',   duck: 1, commentary: '先读 10 篇 thread，再 all-in 一个土狗，然后写 4 推 thread 分析为什么这次能成。下一次又这样。' },
        CRLB: { title: 'KOL 喊单帝',     duck: 4, commentary: '翻 GitHub、翻 audit、翻 LinkedIn，最后在群里高声喊单 BTC ETF。KOL 命格已定。' },
        CRQD: { title: '狙击手老哥',     duck: 6, commentary: '上线前 5 分钟读完合约 + 决定 all-in，从不发言，盈利 5x 直接下车。完美的隐形赢家。' },
        CRQB: { title: '数据驱动沉默者', duck: 1, commentary: '数据驱动、blue chip 为主、年化 30% 默默做。账户被你妈翻出来才有人知道你赚了多少。' },
        HALD: { title: '钻石手土狗党',   duck: 5, commentary: '你的钱包躺着一只 –98% 的土狗已经 3 年。但你天天在群里说「等周期就回来了」。' },
        HALB: { title: '不卖就赢',       duck: 0, commentary: 'BTC 4 万买的，12 万也不卖。群里每天发「不卖就赢」。最稳定的精神股东。' },
        HAQD: { title: '冷冻仓位老哥',   duck: 2, commentary: '三年前梭哈一个土狗，钱包密码自己都忘了，反正不会卖。被动钻石手赢麻了。' },
        HAQB: { title: '2013 年老粉',    duck: 3, commentary: '2013 年买的 BTC，从不发推，仓位市值 8 位数。整个圈子里没几个人见过你。' },
        HRLD: { title: '梗图段子手',     duck: 5, commentary: '长期持有，但每天发 100 张梗图嘲讽别人。Twitter 粉丝靠嘴贱涨。' },
        HRLB: { title: '自媒体老板',     duck: 4, commentary: '写每月报告，长期 BTC 多头，YouTube 50 万订阅。下个周期你就是 CT 顶流。' },
        HRQD: { title: '神隐量化老哥',   duck: 6, commentary: '自己写 bot 跑 yield，仓位披露 = 0。Anon 大佬，圈外人 DYOR 都搜不到你。' },
        HRQB: { title: '冷库教父',       duck: 1, commentary: '冷钱包 + 多签 + 物理保险柜。BTC 数量没人知道，连国家都查不到你的现金流。' },
      },
    },
    community: {
      eyebrow: '加入鸭群',
      bannerParts: ['WAGMI', '一起冲', 'TO THE MOON'],
      sub: '一只鸭。一根 K 线。一个在 BNB Chain 上做最响 meme 的社区。',
      buyCta: '购买 CHONGYA',
      tgCta: 'Telegram',
      xCta: '在 X 上关注',
      discordCta: 'Discord',
    },
    bgm: {
      playAria: '播放背景音乐',
      muteAria: '关闭背景音乐',
    },
    footer: {
      copyright: '保留所有鸭权。',
      disclaimer:
        'CHONGYA 是一个 meme 代币，没有内在价值，也不应被预期产生任何财务回报。加密货币波动极大、风险极高。请自行研究，永远不要投入超过你可以承受损失的资金。本网站不构成任何投资建议。',
    },
  },
};

const LangCtx = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: () => '',
});

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'zh') setLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (path) => {
      const keys = path.split('.');
      let node = dict[lang];
      for (const k of keys) {
        if (node && typeof node === 'object' && k in node) {
          node = node[k];
        } else {
          return '';
        }
      }
      return node;
    },
    [lang]
  );

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}
