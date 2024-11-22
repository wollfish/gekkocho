import { Icons } from '@/components/icons';

const landingPageServices = {
    'global': {
        key: 'global',
        tabIcon: Icons.globe,
        tabTitle: 'Global acceptance',
        contentIcon: Icons.globe,
        contentTitle: 'Global crypto acceptance',
        contentDesc: 'Open your business to the world. Sell digital goods and services seamlessly with 1 click checkout. Tap into the most popular payment methods, empowering your business to drive revenue instantly and securely, wherever your customers are.',
    },
    'currency': {
        key: 'currency',
        tabIcon: Icons.coins,
        tabTitle: '100+ crypto supported',
        contentIcon: Icons.coins,
        contentTitle: '100+ crypto currency supported',
        contentDesc: 'Merchants can process fast and errorless crypto transactions in top currencies supported by CoinDhanPay. They are widely accepted and are consistently being improved..',
    },
    'unlimited': {
        key: 'unlimited',
        tabIcon: Icons.infinity,
        tabTitle: 'No limits',
        contentIcon: Icons.infinity,
        contentTitle: 'No limits on transactions',
        contentDesc: 'Any amount may be transferred in accordance with your requirements. There are no restrictions in terms of upper-limits.',
    },
    'settlement': {
        key: 'settlement',
        tabIcon: Icons.zap,
        tabTitle: 'Instant settlement',
        contentIcon: Icons.zap,
        contentTitle: 'Instant settlement',
        contentDesc: 'Instant settlement. Get paid instantly and settle your funds in your preferred crypto currency. no more waiting for your funds to be settled like traditional payment gateways.',
    },
    'integration': {
        key: 'integration',
        tabIcon: Icons.gitMerge,
        tabTitle: 'Easy integration',
        contentIcon: Icons.gitMerge,
        contentTitle: 'Easy integration on any platform',
        contentDesc: 'Integrate our API & widget with your platform in minutes. No more hassle of setting up a payment gateway. Our API/Widget is easy to use and integrate with your platform.',
    },
    'dashboard': {
        key: 'dashboard',
        tabIcon: Icons.dashboard,
        tabTitle: 'Dashboard',
        contentIcon: Icons.dashboard,
        contentTitle: 'Initiative dashboard',
        contentDesc: 'Track your transactions, view your dashboard, and manage your account with ease. Our dashboard is designed to make your life easier. make withdrawals, deposits, and more.',
    },
};

const landingPageUseCases = {
    'e-commerce': {
        key: 'e-commerce',
        title: 'E-commerce',
        desc: 'The world of e-commerce has experienced massive growth. Reap the benefits of the huge online market by accepting crypto payments.',
        icon: Icons.cart,
    },
    'gaming': {
        key: 'gaming',
        title: 'Gaming',
        desc: 'Online gaming is massively popular. Payment systems for the gaming industry should ideally offer users the chance to play using crypto.',
        icon: Icons.gamepad,
    },
    'forex': {
        key: 'forex',
        title: 'FOREX & CFD Brokers',
        desc: 'Attract new clients by offering them a way to top up their accounts with many different cryptocurrencies.',
        icon: Icons.chart,
    },
    'hedge-funds': {
        key: 'hedge-funds',
        title: 'Hedge / Investment Fund',
        desc: 'Hedge / Investment funds can generate hundreds of millions of dollars in management and performance fees. Crypto payments are an obvious choice.',
        icon: Icons.fund,
    },
    'gambling': {
        key: 'gambling',
        title: 'Gambling',
        desc: 'The global online gambling industry is worth billions of dollars. Crypto payments are fast, secure and allow players to play anonymously.',
        icon: Icons.dice,
    },
    'legal': {
        key: 'legal',
        title: 'Legal Services',
        desc: 'Everything now is regulated by contracts and legal agreements. Experts in that area are in demand. Provide your clients a way to pay for your services in crypto.',
        icon: Icons.law,
    },
    'marketplaces': {
        key: 'marketplaces',
        title: 'Marketplaces',
        desc: 'There are many platforms used by businesses to sell their products or services. Offering crypto payments to customers is now the advantage.',
        icon: Icons.shop,
    },
    'travel': {
        key: 'travel',
        title: 'Travel Industry',
        desc: 'Travelers are always looking for ways to save money. With increasing bookings now made online, it makes sense to accept crypto payments and save money on travels.',
        icon: Icons.plane,
    },
};

const landingPageCryptoVsFiat = [
    {
        feature: 'Decentralisation',
        crypto: 'yes',
        fiat: 'no',
    },
    {
        feature: 'No Rolling Reserve',
        crypto: 'yes',
        fiat: 'no',
    },
    {
        feature: 'Low Cost',
        crypto: 'yes',
        fiat: 'no',
    },
    {
        feature: 'Easy Account Opening',
        crypto: 'yes',
        fiat: 'no',
    },
    {
        feature: 'Transparency',
        crypto: 'yes',
        fiat: 'no',
    },
    {
        feature: 'Fast Settlement',
        crypto: 'yes',
        fiat: 'no',
    },
    {
        feature: 'No Risk of Fraud Card Usage',
        crypto: 'yes',
        fiat: 'no',
    },
    {
        feature: 'Instant Payouts',
        crypto: 'yes',
        fiat: 'Not always',
    },
    {
        feature: 'No Volatility Risks',
        crypto: 'yes',
        fiat: 'no',
    },
    {
        feature: 'Regulated',
        crypto: 'Partially',
        fiat: 'yes',
    },
    {
        feature: 'Transaction Limits',
        crypto: 'No limits',
        fiat: 'Restrictions',
    },
];

const landingPageCryptoSteps = {
    'step-1': {
        key: 'step-1',
        icon: Icons.cursor,
        title: '1: Choosing a Method',
        desc: 'The customer chooses to pay with crypto using our CoinDhan Pay payment method.',
    },
    'step-2': {
        key: 'step-2',
        icon: Icons.eth,
        title: '2: Selecting a Currency',
        desc: 'The customer selects the specific currency they want to use for the transaction.',
    },
    'step-3': {
        key: 'step-3',
        icon: Icons.qrCode,
        title: '3: Transferring Funds',
        desc: 'The customer sends funds to the provided deposit address, which is unique to their payment.',
    },
    'step-4': {
        key: 'step-4',
        icon: Icons.flower,
        title: '4: Requesting Withdrawal',
        desc: 'CoinDhan Pay processes the your withdrawal request and sends the payment in the preferred cryptocurrency.',
    },
};

export const cryptoIcons = {
    ada: { icon: Icons.ada, name: 'Cardano', fill: '#0133AD', id: 'ada' },
    bnb: { icon: Icons.bnb, name: 'BNB', fill: '#F0B90B', id: 'bnb' },
    doge: { icon: Icons.doge, name: 'Dogecoin', fill: '#C2A633', id: 'doge' },
    eth: { icon: Icons.eth, name: 'Ethereum', fill: '#3C3C3D', id: 'eth' },
    helium: { icon: Icons.helium, name: 'Helium', fill: '#0ACF83', id: 'helium' },
    ltc: { icon: Icons.ltc, name: 'Litecoin', fill: '#A6A9AA', id: 'ltc' },
    monero: { icon: Icons.monero, name: 'Monero', fill: '#FF6600', id: 'monero' },
    near: { icon: Icons.near, name: 'Near', fill: '#000000', id: 'near' },
    polkadot: { icon: Icons.polkadot, name: 'Polkadot', fill: '#E6007A', id: 'polkadot' },
    btc: { icon: Icons.btc, name: 'Bitcoin', fill: '#F7931A', id: 'btc' },
    polygon: { icon: Icons.polygon, name: 'Polygon', fill: '#7B3FE4', id: 'polygon' },
    solana: { icon: Icons.solana, name: 'Solana', fill: '#9945FF', id: 'sol' },
    usdt: { icon: Icons.usdt, name: 'Tether', fill: '#50AF95', id: 'usdt' },
    xlm: { icon: Icons.xlm, name: 'Stellar', fill: '#7D00FF', id: 'xlm' },
    xrp: { icon: Icons.xrp, name: 'XRP', fill: '#25A768', id: 'xrp' },
};

export const pageConstants = {
    landing: {
        services: landingPageServices,
        useCases: landingPageUseCases,
        cryptoVsFiat: landingPageCryptoVsFiat,
        cryptoIcons: Object.values(cryptoIcons),
        cryptoSteps: landingPageCryptoSteps,
    },
};
