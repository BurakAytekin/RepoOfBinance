export class BinanceUrl {

    public static apiUrl = 'https://api.binance.com/api/v3/';

    // Test connectivity
    public static pingUrl = BinanceUrl.apiUrl + 'ping';

    // Check server time
    public static timeUrl = BinanceUrl.apiUrl + 'time';

    // Exchange information
    public static exchangeInfoUrl = BinanceUrl.apiUrl + 'exchangeInfo';

    // Order book bids/asks
    public static depthUrl = BinanceUrl.apiUrl + 'depth';

    // Recent trades list
    public static tradesUrl = BinanceUrl.apiUrl + 'trades';

    // Old trade lookup (MARKET_DATA)
    public static historicalTradesUrl = BinanceUrl.apiUrl + 'historicalTrades';

    // Compressed/Aggregate trades list
    public static aggTradesUrl = BinanceUrl.apiUrl + 'aggTrades';

    // Kline/Candlestick data
    public static klinesUrl = BinanceUrl.apiUrl + 'klines';

    // Current average price
    public static avgPriceUrl = BinanceUrl.apiUrl + 'avgPrice';

    // 24hr ticker price change statistics
    public static ticker24hrUrl = BinanceUrl.apiUrl + 'ticker/24hr';

    // Symbol price ticker
    public static tickerPriceUrl = BinanceUrl.apiUrl + 'ticker/price';

    // Symbol order book ticker
    public static bookTickerUrl = BinanceUrl.apiUrl + 'ticker/bookTicker';

    // New order (TRADE) - Query order (USER_DATA) - Cancel order (TRADE)
    public static orderUrl = BinanceUrl.apiUrl + 'order';

    // Test new order (TRADE)
    public static orderTestUrl = BinanceUrl.apiUrl + 'order/test';

    // Cancel All Open Orders on a Symbol (TRADE) - Current open orders (USER_DATA)
    public static openOrdersUrl = BinanceUrl.apiUrl + 'openOrders';

    // All orders (USER_DATA)
    public static allOrdersUrl = BinanceUrl.apiUrl + 'allOrders';

    // New OCO (TRADE)
    public static orderOcoUrl = BinanceUrl.apiUrl + 'order/oco';

    // Cancel OCO (TRADE) - Query OCO (USER_DATA)
    public static orderListUrl = BinanceUrl.apiUrl + 'orderList';

    // Query all OCO (USER_DATA)
    public static allOrderListUrl = BinanceUrl.apiUrl + 'allOrderList';

    // Query Open OCO (USER_DATA)
    public static openOrderListUrl = BinanceUrl.apiUrl + 'openOrderList';

    // Account information (USER_DATA)
    public static accountUrl = BinanceUrl.apiUrl + 'account';

    // Account trade list (USER_DATA)
    public static myTradesUrl = BinanceUrl.apiUrl + 'myTrades';

    // Start user data stream (USER_STREAM) - Keepalive user data stream (USER_STREAM) - Close user data stream (USER_STREAM)
    public static userDataStreamUrl = BinanceUrl.apiUrl + 'userDataStream';


}
