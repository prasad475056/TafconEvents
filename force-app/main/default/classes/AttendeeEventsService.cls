public with sharing class AttendeeEventsService {
    @AuraEnabled(cacheable=true)
    public static list<Event_Attendee__c> upComingEvents(string attendeeId) {
        list<Event_Attendee__c>  attendeupcoming = 
        [
            SELECT 
                id,
                Name,
                Event__c,
                Event__r.Name__c,
                Event__r.Start_Date_Time__c,
                Event__r.Live__c ,
                Event__r.Location__r.Name,
                Event__r.Max_Seats__c,
                Event__r.Event_Organizer__r.Name 
            FROM Event_Attendee__c
            WHERE Attendee__c =: attendeeId
            AND Event__r.Start_Date_Time__c >= Today
            AND Event__r.Live__c = true
            WITH SECURITY_ENFORCED
        ];

        return attendeupcoming;
        
    }

    @AuraEnabled(cacheable=true)
    public static list<Event_Attendee__c> pastEvents(string attendeeId) {
        list<Event_Attendee__c>  attendepastevents = 
        [
            SELECT 
                id,
                Name,
                Event__c,
                Event__r.Name__c,
                Event__r.Start_Date_Time__c,
                Event__r.Live__c ,
                Event__r.Location__r.Name,
                Event__r.Max_Seats__c,
                Event__r.Event_Organizer__r.Name 
            FROM Event_Attendee__c
            WHERE Attendee__c =: attendeeId
            AND Event__r.Start_Date_Time__c < Today
            WITH SECURITY_ENFORCED
        ];

        return attendepastevents;
        
    }
}