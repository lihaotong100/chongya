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
      title: 'Seven ducks. ',
      titleGold: 'One family.',
      sub: 'Each duck wears a different color of the flock. Tap a portrait, meet the crew, pick your duck.',
      tapHint: 'Tap any duck to meet them',
      members: [
        { name: 'Golden Boss', tagline: 'The OG. Leads the charge to the moon.', color: '#F0B90B' },
        { name: 'Snow Builder', tagline: 'Ships code at 3am. Sleeps never.', color: '#F5F5F7' },
        { name: 'Rosy Degen', tagline: 'Buys the dip. Buys the rip. Just buys.', color: '#FF9EC4' },
        { name: 'Violet Whale', tagline: 'Moves the chart when it gets bored.', color: '#B189FF' },
        { name: 'Sky Chad', tagline: 'Calls the next pump before it happens.', color: '#7CB7FF' },
        { name: 'Mint Memer', tagline: 'Viral templates and pure chaos.', color: '#7CE4A2' },
        { name: 'Onyx Sniper', tagline: 'Quiet in chat. Loudest on the chart.', color: '#2A2A33' },
      ],
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
      title: '七只鸭，',
      titleGold: '一个家。',
      sub: '每只鸭子代表鸭群里的一种颜色。点一张头像，认识全员，挑一只你的鸭子。',
      tapHint: '点击任意鸭子认识它',
      members: [
        { name: '金色老大', tagline: '元老。带头冲向月球。', color: '#F0B90B' },
        { name: '雪白码农', tagline: '凌晨三点提交代码。从不睡觉。', color: '#F5F5F7' },
        { name: '玫红 Degen', tagline: '抄底也买，追高也买，反正就是买。', color: '#FF9EC4' },
        { name: '紫色巨鲸', tagline: '无聊的时候顺手砸/拉一下盘。', color: '#B189FF' },
        { name: '天蓝大佬', tagline: '在拉盘发生之前就喊单。', color: '#7CB7FF' },
        { name: '薄荷段子手', tagline: '负责生产爆款梗图和混乱。', color: '#7CE4A2' },
        { name: '玄武狙击手', tagline: '群里沉默。线上最响。', color: '#2A2A33' },
      ],
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
