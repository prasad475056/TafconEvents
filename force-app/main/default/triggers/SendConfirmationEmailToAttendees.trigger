trigger SendConfirmationEmailToAttendees on Event_Attendee__c (After insert) {
    if(trigger.isAfter && trigger.isInsert){
        AttendeeEmailHandler.sendConfirmationEmailsToAttendees(trigger.new);
    }
}