export const priceFormatter = (string) => {
    const number = parseFloat(string);
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}