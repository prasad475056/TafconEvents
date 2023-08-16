import { LightningElement,track,api } from 'lwc';
import upcomingEvents from '@salesforce/apex/EventDetailsService.upcomingEvents';
import { NavigationMixin } from 'lightning/navigation';

const actions = [
    { label: 'view details', name: 'view_details' },
    
];
const eventListColumns = [
    
    {
        label: "EventName",
        fieldName: "Name",
        wrapText: "true",
        cellAttributes: {
          iconName: "standard:event",
          iconPosition: "left"
        }
      },
      {
        label: "Organizer",
        fieldName: "OrganizerName",
        wrapText: "true",
        cellAttributes: {
          iconName: "standard:event",
          iconPosition: "left"
        }
      },
      {
            label: "StartDate",
            fieldName: "StartDateTime",
            type: "date",
            typeAttributes:{
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
      },
      {
        label: "EndDate",
        fieldName: "EndDateTime",
        type: "date",
        typeAttributes:{
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
  },
  { label: 'Location', fieldName: 'Location', type: 'text' },
  { type: 'action', typeAttributes: { rowActions: actions } }
];
export default class EventList extends NavigationMixin (LightningElement){

    @track errors
   
    @track recordsToDisplay;
    @track recordsToStore;
    @track startdattime
    @track columnsList = eventListColumns;

    connectedCallback(){
        this.upcomingEventsFromApex();
    }
    upcomingEventsFromApex(){
        upcomingEvents()
        .then((data)=>{
            console.log('data:'+JSON.stringify(data));
           var modifiedEventList = data.map((Event)=>{
                let tempEvent = {};  
                    tempEvent.Id = Event.Id;
                    tempEvent.Name = Event.Name__c;
                    tempEvent.StartDateTime = Event.Start_Date_Time__c;
                    tempEvent.EndDateTime = Event.End_Date_Time__c;
                    tempEvent.MaxSeats = Event.Max_Seats__c;
                    tempEvent.OrganizerName = Event.Event_Organizer__r.Name;
                    if(Event.Location__r.Name){
                     tempEvent.Location = Event.Location__r.Name;
                    }
                    tempEvent.eventDetails = Event.Event_Detail__c;

                    return tempEvent;
              });
              
              this.recordsToStore = modifiedEventList;
              this.recordsToDisplay = this.recordsToStore;
              console.log('modified data :'+JSON.stringify(this.recordsToDisplay));
              this.errors = undefined;
             
        }).catch((err)=>{
            this.recordsToDisplay = undefined;;
              this.errors = err;
        });
    }  
    
    handleSearch(event){
       let keyword = event.detail.value;
       console.log('keyword:'+this.keyword);
       
       let modifiedData = [];

       for(var r = 0; r < this.recordsToStore.length ; r++){
        if(this.recordsToStore[r].Name.toLowerCase().includes(keyword.toLowerCase())){
            modifiedData.push(this.recordsToStore[r]);
        }
       }
       console.log('modified data :'+JSON.stringify(modifiedData));
       this.recordsToDisplay = modifiedData;
       console.log('after all :'+JSON.stringify(this.recordsToDisplay));
    }
    handleStartDate(event){
        let datetime = event.detail.value;
        let modifiedData = [];

        for(var r=0; r< this.recordsToStore.length; r++){
            if(this.recordsToStore[r].StartDateTime >= datetime){
                modifiedData.push(this.recordsToStore[r]);
            }
        }
        console.log('modified date :'+modifiedData);
        this.recordsToDisplay = modifiedData;

    }
    handleLocationSearch(event){
        let keyword = event.detail.value;
        console.log('keyword :'+keyword);
        let modifiedData = [];
        for(var r=0; r < this.recordsToStore.length; r++){
            if(this.recordsToStore[r].Location.toLowerCase().includes(keyword.toLowerCase())){
                modifiedData.push(this.recordsToStore[r]);
            }
        }
        console.log('filtered location records'+modifiedData);
        this.recordsToDisplay = modifiedData;
        
    }
    handleRowAction(event){
        const action = event.detail.action;
        const row = event.detail.row;
        console.log('event.detail.action'+JSON.stringify(event.detail.action));
        console.log('event.detail.row'+JSON.stringify(event.detail.row));

        switch(action.name){
            case 'view_details':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                break;
        }
         

    }
}