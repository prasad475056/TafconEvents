public with sharing class EventDetailsController {
    @AuraEnabled(cacheable=true)
    public static List<Event_Speaker__c> speakerMethod(string eventId){ 

     List<Event_Speaker__c> speakersRecords =    

    [
        SELECT 
            Id,
            Event__c, 
            Speaker__c, 
            Speaker__r.Name,  
            Speaker__r.Company__c,  
            Speaker__r.Email__c,   
            Speaker__r.About_me__c, 
            Speaker__r.Phone__c, 
            Speaker__r.image_link__c
        FROM Event_Speaker__c
        WHERE Event__c =: eventId
       
        
    ];
    return speakersRecords;

    }

    @AuraEnabled(cacheable=true)
  public static Event__c getLocationDetails(String eventId) {
    Event__c eventRecord = [
      SELECT
        Id,
        Name,
        Location__c,
        Location__r.Name,
        Location__r.City__c,
        Location__r.Country__c,
        Location__r.Land_Mark__c,
        Location__r.Postal_code__c,
        Location__r.State__c,
        Location__r.Street__c
      FROM Event__c
      WHERE Id = :eventId
      WITH SECURITY_ENFORCED
    ];
    return eventRecord;
  }

  @AuraEnabled(cacheable=true)
  public static List<Event_Attendee__c> getAttendees(String eventId) {
    List<Event_Attendee__c> eventAttendeeList = [
      SELECT
        Id,
        Name,
        Attendee__c,
        Attendee__r.Name,
        Attendee__r.Email__c,
        Attendee__r.Company_Name__c,
        Attendee__r.Location1__c,
        Attendee__r.Location1__r.Name
      FROM Event_Attendee__c
      WHERE Event__c = :eventId
      WITH SECURITY_ENFORCED
    ];
    return eventAttendeeList;
  }
}