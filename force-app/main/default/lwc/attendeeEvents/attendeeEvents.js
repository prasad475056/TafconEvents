import { LightningElement,track,api } from 'lwc';
import upComingEvents from '@salesforce/apex/AttendeeEventsService.upComingEvents';
import pastEvents from '@salesforce/apex/AttendeeEventsService.pastEvents';
const columns = [
    
   {
        label:"Serial Number",
        fieldName:"Number",
        wrapText: "true",
        type:"text"
   },
   {
    label: "EventName",
    fieldName: "EventName",
    wrapText: "true",
    cellAttributes: {
        class: 'slds-text-color_success slds-text-title_caps',
    }
   },
   {
    label: "StartDate",
    fieldName: "StartDate",
    type: "date",
    wrapText: "true",
    typeAttributes:{
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    }
   },
   {
     label:"maximum seats",
     fieldName:"maxseats",
     type:"text",
     wrapText:"true"
   },
   {
     label:"Event Organizer",
     fieldName:"EventOrganizer",
     type:"text",
     wrapText:"true",
     cellAttributes: {
        class: 'slds-text-color_success slds-text-title_caps',
    }
   },
   {
    label:"Event Location",
    fieldName:"Location",
    type:"text",
    wrapText:"true",
     cellAttributes: {
        class: 'slds-text-color_success slds-text-title_caps',
    }
   }

   
];
export default class AttendeeEvents extends LightningElement {
@api recordId;
@track UpcomingEvents;
@track pastEvents;
@track listOfcolumns = columns;
@track errors;

    connectedCallback(){    
        this.upComingEventsFunction();
        this.pastEventsFunction();
    }

    upComingEventsFunction(){
        upComingEvents({
            attendeeId: this.recordId
        })
        .then((data)=>{
            console.log('data :'+JSON.stringify(data));
            let modifiedData = data.map((eveatt)=>{
                let dummyAttende = {};
                      dummyAttende.Id = eveatt.Id;
                      dummyAttende.Number = eveatt.Name;
                      dummyAttende.EventName = eveatt.Event__r.Name__c;
                      dummyAttende.StartDate = eveatt.Event__r.Start_Date_Time__c;
                      dummyAttende.maxseats = eveatt.Event__r.Max_Seats__c;
                      dummyAttende.EventOrganizer = eveatt.Event__r.Event_Organizer__r.Name;
                      dummyAttende.Location = eveatt.Event__r.Location__r.Name;
                      return dummyAttende;
                });
              console.log('afterloopingupcoming :'+JSON.stringify(modifiedData));
            this.UpcomingEvents = modifiedData;
              this.errors = undefined;
    
        }).catch((err)=>{
            console.log('err :'+err);
            this.upComingEvents = undefined;
            this.errors = err;
        });
    }

    pastEventsFunction(){
        pastEvents({
            attendeeId: this.recordId
        })
        .then((data)=>{
            console.log('data:'+JSON.stringify(data));
            let modifiedData = data.map((eveatt)=>{
                let dummyAttende = {};
                      dummyAttende.Id = eveatt.Id;
                      dummyAttende.Number = eveatt.Name;
                      dummyAttende.EventName = eveatt.Event__r.Name__c;
                      dummyAttende.StartDate = eveatt.Event__r.Start_Date_Time__c;
                      dummyAttende.maxseats = eveatt.Event__r.Max_Seats__c;
                      dummyAttende.EventOrganizer = eveatt.Event__r.Event_Organizer__r.Name;
                      dummyAttende.Location = eveatt.Event__r.Location__r.Name;
                      return dummyAttende;
                });
              console.log('afterloopingPast :'+JSON.stringify(modifiedData));
              this.pastEvents = modifiedData;
              this.errors = undefined;
        })
        .catch((err)=>{
            this.pastEvents = undefined;
              this.errors = err;
        })
    }
    
}