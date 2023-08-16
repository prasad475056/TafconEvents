import { LightningElement,api,track } from 'lwc';

export default class Lwcrecordlist extends LightningElement {
     /* Public Property to pass the single record & iconname */
  @api rec;
  @api iconname = "standard:account";
  @api parentidfield;

  handleSelect(event){
    console.log('selected record :'+this.rec);
    console.log('parentidField on lwcRecordList :'+this.parentidfield);
    let selectEvent = new CustomEvent("select", {
        detail: {
          selRec: this.rec,
          parent: this.parentidfield
        }
      });
      this.dispatchEvent(selectEvent);
  }
  handleRemove() {
    let selectEvent = new CustomEvent("select", {
      detail: {
        selRec: undefined,
        parent: this.parentidfield
      }
    });
    this.dispatchEvent(selectEvent);
  }
}