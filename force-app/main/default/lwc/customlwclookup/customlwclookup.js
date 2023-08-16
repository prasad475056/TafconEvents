import { LightningElement, api, track } from 'lwc';
import searchRecords from '@salesforce/apex/CustomSearchController.searchRecords';
export default class Customlwclookup extends LightningElement {
    @api objectName = '';
    @api fieldName = '';
    @api iconname = 'standard:record';
    @api label = '';
    @api parentidfield = '';

     /* private property */
     @track records;
     @track selectedRecord;
     @track organizer = [];

     hanldeSearch(event){
        var searchVal = event.detail.value;
        console.log('values : '+searchVal);
        console.log('objectApiName : '+this.objectName);
        console.log('fieldName :'+this.fieldName);
        console.log('parentidField : '+this.parentidfield);
        searchRecords({
            objName: this.objectName,
            fieldName: this.fieldName,
            searchKey: searchVal
        })
          .then(data => {
            if(data){
                console.log('records from database  : '+data);
                let obj = JSON.parse(data); 

                    for(var i= 0; i < obj.length; i++){
                         let parentarray = obj[i];
                        for(var j=0; j < parentarray.length; j++){
                             let child = parentarray[j];
                            //creating object variable
                             let smallobj = {};
                             smallobj.Id = child.Id;
                              smallobj.Name = child.Name;
                              //adding to organizer array
                            this.organizer.push(smallobj);
                        }
                    }
                        this.records = this.organizer;
                        console.log('records :'+JSON.stringify(this.records));
                    
            }  
          })
          .catch(error => {
            window.console.log(' error ', error);
          });
    
     }

     handleSelect(event) {
        var selectedVal = event.detail.selRec;
        this.selectedRecord = selectedVal;
        let finalRecEvent = new CustomEvent('select', {
            detail: { selectedRecordId: this.selectedRecord.Id, parentfield: this.parentidfield }
        });
        this.dispatchEvent(finalRecEvent);
    }

    handleRemove() {
        this.selectedRecord = undefined;
        this.records = undefined;
        let finalRecEvent = new CustomEvent('select', {
            detail: { selectedRecordId: undefined, parentfield: this.parentidfield }
        });
        this.dispatchEvent(finalRecEvent);
    }


}