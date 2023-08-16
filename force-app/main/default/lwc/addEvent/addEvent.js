import { LightningElement , track} from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import EVENT_OBJECT from '@salesforce/schema/Event__c';
import Name__c from '@salesforce/schema/Event__c.Name__c';
import Start_Date_Time__c from '@salesforce/schema/Event__c.Start_Date_Time__c';
import End_Date_Time__c from '@salesforce/schema/Event__c.End_Date_Time__c';
import Event_Organizer__c from '@salesforce/schema/Event__c.Event_Organizer__c';
import Max_Seats__c from '@salesforce/schema/Event__c.Max_Seats__c';
import Location__c from '@salesforce/schema/Event__c.Location__c'; 
import Event_Detail__c from '@salesforce/schema/Event__c.Event_Detail__c'; 

import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AddEvent extends NavigationMixin (LightningElement){

    @track eventRecord = {
        Name__c : '',
        Start_Date_Time__c : null,
        End_Date_Time__c : null,
        Event_Organizer__c : '',
        Max_Seats__c : '',
        Location__c : '',
        Event_Detail__c : ''
    }
    @track errors = '';

    handleChange(event){
        
        let value = event.target.value;
        let Name__c = event.target.name;
        this.eventRecord[Name__c] = value;
        console.log('field value'+this.eventRecord.Name__c);
    }

    handleLookup(event){
        let selectedRecId = event.detail.selectedRecordId;
        console.log('parentfield in detail  : '+JSON.stringify(event.detail.parentfield));
        let parentField = event.detail.parentfield;
        this.eventRecord[parentField] = selectedRecId;
    }


    handleClick(event){
        console.log('event record :'+JSON.stringify(this.eventRecord));
        alert('command in handleClick');
        const fields = {};

        fields[Name__c.fieldApiName] = this.eventRecord.Name__c;
        fields[Event_Organizer__c.fieldApiName] = this.eventRecord.Event_Organizer__c;
        fields[Start_Date_Time__c.fieldApiName] = this.eventRecord.Start_Date_Time__c;
        fields[End_Date_Time__c.fieldApiName] = this.eventRecord.End_Date_Time__c;
        fields[Max_Seats__c.fieldApiName] = this.eventRecord.Max_Seats__c;
        fields[Location__c.fieldApiName] = this.eventRecord.Location__c;
        fields[Event_Detail__c.fieldApiName] = this.eventRecord.Event_Detail__c;

        console.log(JSON.stringify(fields));

        const eventRecord2 = { apiName: EVENT_OBJECT.objectApiName, fields };

        createRecord(eventRecord2)
        .then((eventRec) => {
            console.log('recird Id :'+eventRec.id );
            this.dispatchEvent(new ShowToastEvent({
                title: 'Record Saved',
                message: 'Event Draft is Ready',
                variant: 'success'
            }));

            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                    attributes: {
                        recordId: eventRec.id,
                        objectApiName: 'Event__c',
                        actionName: "view"
                    }
            });

        })
        .catch((err) => {
            this.errors = JSON.stringify(err);
            console.log('errors :'+this.errors);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error Occured',
                    message: this.errors,
                    variant: 'error'
                }));
        });
    }

    handleCancel(){
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                actionName: "home",
                objectApiName: "Event__c"
            }
        });
    }



}