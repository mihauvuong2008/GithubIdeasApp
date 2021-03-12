class volumeData{
  constructor(volumeData, discount, price, quantily, voucherID, selected, dateadded){
    this.id =  volumeData.id;
    this.volumeData = volumeData;
    this.discount = discount;
    this.price = price;
    this.quantily = quantily;
    this.voucherID = voucherID;
    this.selected = selected;
    this.dateadded = new Date()
    ;
  }
}
