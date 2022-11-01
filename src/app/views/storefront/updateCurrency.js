import CC from 'currency-converter-lt';

export const updatePrice = async function(amount,to){
    let CurrencyConvertor = new CC(parseFloat(amount),'usd',to);
    let p = await CurrencyConvertor.convert();
    return p;
}