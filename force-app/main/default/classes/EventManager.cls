@RestResource(urlmapping='/prasad/futureEvents')
global with sharing class EventManager {
    @httpGet
   global static list<Event__c> upcomingEvents(){
    list<Event__c> futureEvents = [
        SELECT
                id,
                Name__c,
                Status__c, 
                Start_Date_Time__c, 
                End_Date_Time__c, 
                Event_Detail__c,
                Event_Organizer__r.Name, 
                Event_Type__c,
                Frequency__c,
                Live__c,
                Location__r.Name,
                Location_Verified__c,
                Max_Seats__c,
                People_Attending__c,
                Recurring__c,
                Remaining_Seats__c 
            FROM Event__c
            WHERE  Start_Date_Time__c >= Today AND Live__c = true
            WITH SECURITY_ENFORCED
    ];
    return futureEvents;
   }
}