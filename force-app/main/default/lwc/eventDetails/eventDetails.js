import { LightningElement,track,api,wire } from 'lwc';
import speakerMethod from '@salesforce/apex/EventDetailsController.speakerMethod';
import getLocationDetails from '@salesforce/apex/EventDetailsController.getLocationDetails';
import getAttendees from '@salesforce/apex/EventDetailsController.getAttendees';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";
import userId from "@salesforce/user/Id";
import { getRecord } from "lightning/uiRecordApi";
import profile from "@salesforce/schema/User.Profile.Name";

const columnsforuser = [
  {
    label: "Name",
    fieldName: "Name",
    cellAttributes: {
      iconName: "standard:user",
      iconPosition: "left"
    }
  },
  { label: "Email", fieldName: "Email", type: "email" },
  { label: "Phone", fieldName: "Phone", type: "phone" },
  { label: "Company Name", fieldName: "CompanyName" }
];

const columnAtt = [
{
  label : "Name",
  fieldName : "Name",
  cellAttributes:{
     iconName: "standard:user",
      iconPosition: "left"
  }
},
  { label: "Email", fieldName: "Email", type: "email" },
  { label: "Location", fieldName: "Location", type: "text" },
  { label: "Company Name", fieldName: "CompanyName" }
];
export default class EventDetails extends NavigationMixin (LightningElement){
    @api recordId;
    @api objectApiName;
    @track speakerList;
    @track eventRec;
    @track attendeesList;
    columns = columnAtt;
    userColumns = columnsforuser;
    user_id = userId;
    errors;

    @wire(getRecord,{recordId: "$user_id", fields: [profile]})
    wiredMethod({ error, data }) {
      if (data) {
        console.log(" userRecord ", data);
      }
      if (error) {
        console.log("Error Occurred ", JSON.stringify(error));
      }
    }


    handleSpeakerActive(){
        speakerMethod({     
            eventId: this.recordId
        })
        .then((result) =>{
            console.log('result :'+JSON.stringify(result));
            var neweventSpeakerArr = result.map(newSpec=>{
              let newEventSpec = {};
              newEventSpec.Name = newSpec.Speaker__r.Name;
              newEventSpec.Email = newSpec.Speaker__r.Email__c;
              newEventSpec.Phone = newSpec.Speaker__r.Phone__c;
              newEventSpec.ImageLink = newSpec.Speaker__r.image_link__c;
              return newEventSpec;
           });
            console.log('neweventSpeakerArr'+JSON.stringify(neweventSpeakerArr));
          this.speakerList = neweventSpeakerArr;
          console.log('after looping :'+JSON.stringify(this.speakerList));
          this.errors = undefined;
         
            
        }).catch((err)=>{
          this.speakerList = undefined;
          this.errors = err;
        });
    }

    createSpeaker(){
      const defaultValues = encodeDefaultFieldValues({
        Event__c: this.recordId
      });
      this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
           objectApiName: 'Event_Speaker__c',
           actionName: 'new'
        },
        state: {
            defaultFieldValues: defaultValues
        }
     });
    }

    handleLocatioDetails(){
        getLocationDetails({
            eventId: this.recordId
        })
          .then((result)=>{
            console.log('result :'+result);
            if (result.Location__c) {
                this.eventRec = result;
              } else {
                this.eventRec = undefined;
              }
              this.errors = undefined;
          }).catch((err)=>{
            this.errors = err;
            this.speakerList = undefined;
          })
    }
    handleEventAttendee(){
      getAttendees({
        eventId: this.recordId
      })
      .then((result)=>{
        console.log('attendees :'+JSON.stringify(result));
        var newAttendeArray = result.map(newAtt=>{
           let newAttendee = {};
           newAttendee.Name = newAtt.Attendee__r.Name;
           newAttendee.Email = newAtt.Attendee__r.Email__c;
           newAttendee.CompanyName = newAtt.Attendee__r.Company_Name__c;
           if (newAtt.Attendee__r.Location1__c) {
                   newAttendee.Location = newAtt.Attendee__r.Location1__r.Name;
           }else {
                     newAttendee.Location = "Preferred Not to Say";
                 }
                 return newAttendee;
        });
        
          this.attendeesList = newAttendeArray;
          console.log('attendee list :'+JSON.stringify(this.attendeesList));
          this.errors = undefined;        
      })
      .catch((err)=>{
          this.errors = err;
          this.speakerList = undefined;
      });
    }

      createAttendee(){
        
        const defaultValues = encodeDefaultFieldValues({
          Event__c: this.recordId
        });
        this[NavigationMixin.Navigate]({
          type: 'standard__objectPage',
          attributes: {
             objectApiName: 'Event_Attendee__c',
             actionName: 'new'
          },
          state: {
              defaultFieldValues: defaultValues
          }
       });
    }

}