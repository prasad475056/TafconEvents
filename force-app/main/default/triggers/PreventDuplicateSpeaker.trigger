trigger PreventDuplicateSpeaker on Event_Speaker__c (before insert, before update) {
   
	// Step 1 - Get the speaker id & event id 
	// Step 2 - SOQL on Event to get the Start Date and Put them into a Map
	// Step 3 - SOQL on Event - Spekaer to get the Related Speaker along with the Event Start Date
	// Step 4 - Check the Conditions and throw the Error

    if(trigger.isBefore && trigger.isInsert){
        set<id> eventsIds = new set<id>();
        set<id> speakerIds = new set<id>();

        for(Event_Speaker__c es : trigger.new){
            // Step 1 - Get the speaker id & event id 
            eventsIds.add(es.Event__c);
            speakerIds.add(es.Speaker__c);
        }
        Map<Id, DateTime> requestedEvents = new Map<Id, DateTime>();
    
        List<Event__c> relatedEventList = [Select Id, Start_Date_Time__c From Event__c 
                                       Where Id IN : eventsIds];
    
        for(Event__c evt : relatedEventList ){
            // Step 2 - SOQL on Event to get the Start Date and Put them into a Map
            requestedEvents.put(evt.Id, evt.Start_Date_Time__c);
        }
            // Step 3 - SOQL on Event - Spekaer to get the Related Speaker along with the Event Start Date
        List<Event_Speaker__c> relatedEventSpeakerList = [ SELECT Id, Event__c, Speaker__c,
                                               Event__r.Start_Date_Time__c
                                               From Event_Speaker__c
                                               WHERE Speaker__c IN : speakerIds];
         // Step 4 - Check the Conditions and throw the Error                                      
        for(Event_Speaker__c es : trigger.new){
            DateTime bookingTime = requestedEvents.get(es.Event__c); 
            for(Event_Speaker__c es1 : relatedEventSpeakerList) {
               
                if(es1.Speaker__c == es.Speaker__c && es1.Event__r.Start_Date_Time__c == bookingTime ){
                    es.Speaker__c.addError('The speaker is already booked at that time');
                    es.addError('The speaker is already booked at that time');
                }
            }
        }                                       
    }  
}